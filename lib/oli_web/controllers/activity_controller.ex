defmodule OliWeb.ActivityController do
  use OliWeb, :controller
  use OpenApiSpex.Controller

  alias Oli.Authoring.Editing.ActivityEditor
  alias Oli.Accounts
  alias Oli.Delivery.Attempts
  alias Oli.Delivery.Attempts.StudentInput
  alias OliWeb.Common.Breadcrumb
  alias Oli.Delivery.Sections
  alias Oli.Publishing.DeliveryResolver

  import OliWeb.ProjectPlugs

  plug :fetch_project when action in [:edit]
  plug :authorize_project when action in [:edit]

  @moduledoc tags: ["Storage Service"]

  @moduledoc """
  The storage service allows activity implementations to read, write, update
  and delete documents associated with an activity instance.
  """

  alias OpenApiSpex.Schema

  @doc false
  def edit(conn, %{
        "project_id" => project_slug,
        "revision_slug" => revision_slug,
        "activity_slug" => activity_slug
      }) do
    author = conn.assigns[:current_author]
    is_admin? = Accounts.is_admin?(author)

    # full title, short title, link, action descriptions

    case ActivityEditor.create_context(project_slug, revision_slug, activity_slug, author) do
      {:ok, context} ->
        render(conn, "edit.html",
          active: :curriculum,
          breadcrumbs:
            Breadcrumb.trail_to(project_slug, revision_slug) ++
              [Breadcrumb.new(%{full_title: context.title})],
          project_slug: project_slug,
          is_admin?: is_admin?,
          activity_slug: activity_slug,
          script: context.authoringScript,
          context: Jason.encode!(context)
        )

      {:error, :not_found} ->
        render(conn, OliWeb.SharedView, "_not_found.html",
          breadcrumbs: [
            Breadcrumb.curriculum(project_slug),
            Breadcrumb.new(%{full_title: "Not Found"})
          ]
        )
    end
  end

  defmodule DocumentAttributes do
    require OpenApiSpex

    OpenApiSpex.schema(%{
      title: "Activity document attributes",
      description: "The top-level attributes of activity documents",
      type: :object,
      properties: %{
        title: %Schema{type: :string, description: "Title of this document"},
        objectives: %Schema{type: :object, description: "Per part objective mapping"},
        content: %Schema{type: :object, description: "Delivery specific content"},
        authoring: %Schema{type: :object, description: "The authoring specific portion of the content"}
      },
      required: [],
      example: %{
        "title" => "Adaptive Activity Ensemble C",
        "objectives" => %{},
        "content" => %{"items" => ["1", "2"]}
      }
    })
  end


  defmodule CreationResponse do
    require OpenApiSpex

    OpenApiSpex.schema(%{
      title: "Update response",
      description: "The response to a successful document update request",
      type: :object,
      properties: %{
        result: %Schema{type: :string, description: "The literal value of 'success'"},
        resource_id: %Schema{type: :string, description: "The identifier for the newly created resource"}
      },
      required: [:result, :resource_id],
      example: %{
        "result" => "success",
        "resource_id" => "239820"
      }
    })
  end

  defmodule UpdateResponse do
    require OpenApiSpex

    OpenApiSpex.schema(%{
      title: "Update response",
      description: "The response to a successful document update request",
      type: :object,
      properties: %{
        result: %Schema{type: :string, description: "The literal value of 'success'"}
      },
      required: [:result],
      example: %{
        "result" => "success"
      }
    })
  end

  @doc """
  Create a new secondary document for an activity.
  """
  @doc parameters: [
    project: [in: :url, schema: %OpenApiSpex.Schema{type: :string}, required: true, description: "The project identifier"],
    resource: [in: :url, schema: %OpenApiSpex.Schema{type: :string}, required: true, description: "The activity identifier that this document will be secondary to"]
  ],
  request_body: {"Attributes for the document", "application/json", OliWeb.ActivityController.DocumentAttributes, required: true},
  responses: %{
    201 => {"Creation Response", "application/json", OliWeb.ActivityController.CreationResponse}
  }
  def create_secondary(conn, %{
        "project" => project_slug,
        "resource" => activity_id
      }) do

    author = conn.assigns[:current_author]
    update = conn.body_params

    case ActivityEditor.create_secondary(project_slug, activity_id, author, update) do
      {:ok, revision} ->
        conn
        |> put_status(:created) # This sets status code 201 instead of 200
        |> json(%{"result" => "success", "resource_id" => revision.resource_id})

      {:error, {:invalid_update_field}} ->
        error(conn, 400, "invalid update field")

      {:error, {:not_found}} ->
        error(conn, 404, "not found")

      {:error, {:not_authorized}} ->
        error(conn, 403, "unauthorized")

      _ ->
        error(conn, 500, "server error")
    end

  end

  @doc false
  def create(conn, %{
        "project" => project_slug,
        "activity_type" => activity_type_slug,
        "model" => model,
        "objectives" => objectives
      }) do
    author = conn.assigns[:current_author]

    case ActivityEditor.create(project_slug, activity_type_slug, author, model, objectives) do
      {:ok, {%{slug: slug}, transformed}} ->
        json(conn, %{"type" => "success", "revisionSlug" => slug, "transformed" => transformed})

      {:error, {:not_found}} ->
        error(conn, 404, "not found")

      {:error, {:not_authorized}} ->
        error(conn, 403, "unauthorized")

      _ ->
        error(conn, 500, "server error")
    end
  end

  @doc """
  Retrieve a document for an activity.
  """
  @doc parameters: [
    project: [in: :url, schema: %OpenApiSpex.Schema{type: :string}, required: true, description: "The project identifier"],
    resource: [in: :url, schema: %OpenApiSpex.Schema{type: :string}, required: true, description: "The activity document identifier"]
  ],
  responses: %{
    200 => {"Retrieval Response", "application/json", OliWeb.ActivityController.DocumentAttributes}
  }
  def retrieve(conn, %{
    "project" => project_slug,
    "resource" => activity_id
  }) do
    author = conn.assigns[:current_author]

    case ActivityEditor.retrieve(project_slug, activity_id, author) do
      {:ok, %{objectives: objectives, title: title, content: content}} ->

        result = %{
          "result" => "success",
          "objectives" => objectives,
          "title" => title,
          "content" => Map.delete(content, "authoring"),
          "authoring" => Map.get(content, "authoring")
        }

        json(conn, result)

      {:error, {:not_found}} -> error(conn, 404, "not found")
      _ -> error(conn, 500, "server error")
    end

  end

  @doc """
  Retrieve a document for an activity for delivery purposes.
  """
  @doc parameters: [
    course: [in: :url, schema: %OpenApiSpex.Schema{type: :string}, required: true, description: "The course identifier"],
    resource: [in: :url, schema: %OpenApiSpex.Schema{type: :string}, required: true, description: "The activity document identifier"]
  ],
  responses: %{
    200 => {"Retrieval Response", "application/json", OliWeb.ActivityController.DocumentAttributes}
  }
  def retrieve_delivery(conn, %{
    "course" => course,
    "resource" => activity_id
  }) do

    user = conn.assigns.current_user

    case Sections.get_section_by(id: course) do

      nil -> error(conn, 404, "not found")

      section ->
        if Sections.is_enrolled?(user.id, section.context_id) do

          case DeliveryResolver.from_resource_id(section.context_id, activity_id) do
            nil -> error(conn, 404, "not found")

            rev -> json(conn, %{"result" => "success", "title" => rev.title, "content" => Map.delete(rev.content, "authoring")})
          end

        else
          IO.inspect Sections.list_sections()
          IO.inspect section.context_id
          IO.inspect Sections.list_enrollments(section.context_id)
          error(conn, 403, "unauthorized")
        end

    end

  end

  @doc """
  Update a document for an activity.
  """
  @doc parameters: [
    project: [in: :url, schema: %OpenApiSpex.Schema{type: :string}, required: true, description: "The project identifier"],
    resource: [in: :url, schema: %OpenApiSpex.Schema{type: :string}, required: true, description: "The activity identifier that this document will be secondary to"],
    lock: [in: :query, schema: %OpenApiSpex.Schema{type: :string}, required: true, description: "The lock identifier that this operation will be performed within"]
  ],
  request_body: {"Attributes for the document", "application/json", OliWeb.ActivityController.DocumentAttributes, required: true},
  responses: %{
    200 => {"Update Response", "application/json", OliWeb.ActivityController.UpdateResponse}
  }
  def update(conn, %{
        "project" => project_slug,
        "lock" => lock_id,
        "resource" => activity_id
      }) do

    author = conn.assigns[:current_author]


    update = conn.body_params

    case ActivityEditor.edit(project_slug, lock_id, activity_id, author.email, update) do
      {:ok, _} -> json(conn, %{"result" => "success"})
      {:error, {:invalid_update_field}} -> error(conn, 400, "invalid update field")
      {:error, {:not_found}} -> error(conn, 404, "not found")
      {:error, {:not_authorized}} -> error(conn, 403, "unauthorized")
      _ -> error(conn, 500, "server error")
    end
  end

  @doc false
  def evaluate(conn, %{"model" => model, "partResponses" => part_inputs}) do
    parsed =
      Enum.map(part_inputs, fn %{"attemptGuid" => part_id, "response" => input} ->
        %{part_id: part_id, input: %StudentInput{input: Map.get(input, "input")}}
      end)

    case Attempts.perform_test_evaluation(model, parsed) do
      {:ok, evaluations} -> json(conn, %{"type" => "success", "evaluations" => evaluations})
      {:error, _} -> error(conn, 500, "server error")
    end
  end

  @doc false
  def transform(conn, %{"model" => model}) do
    case Attempts.perform_test_transformation(model) do
      {:ok, transformed} -> json(conn, %{"type" => "success", "transformed" => transformed})
      {:error, _} -> error(conn, 500, "server error")
    end
  end

  @doc """
  Delete a secondary document for an activity.
  """
  @doc parameters: [
    project: [in: :url, schema: %OpenApiSpex.Schema{type: :string}, required: true, description: "The project identifier"],
    resource: [in: :url, schema: %OpenApiSpex.Schema{type: :string}, required: true, description: "The activity identifier that this document will be secondary to"],
    lock: [in: :query, schema: %OpenApiSpex.Schema{type: :string}, required: true, description: "The lock identifier that this operation will be performed within"]
  ],
  responses: %{
    200 => {"Deletion Response", "application/json", OliWeb.ActivityController.UpdateResponse}
  }
  def delete(conn, %{"project" => project_slug, "resource" => resource_id, "lock" => lock_id}) do

    author = conn.assigns[:current_author]

    case ActivityEditor.delete(project_slug, lock_id, resource_id, author) do
      {:ok, _} -> json(conn, %{"result" => "success"})
      {:error, {:not_applicable}} -> error(conn, 400, "not applicable to this resource")
      {:error, {:not_found}} -> error(conn, 404, "not found")
      {:error, {:not_authorized}} -> error(conn, 403, "unauthorized")
      _ -> error(conn, 500, "server error")
    end

  end

  defp error(conn, code, reason) do
    conn
    |> send_resp(code, reason)
    |> halt()
  end
end
