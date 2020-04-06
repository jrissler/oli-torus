defmodule Oli.LocksTest do
  use Oli.DataCase

  alias Oli.Publishing

  alias Oli.Accounts.SystemRole
  alias Oli.Accounts.Institution
  alias Oli.Accounts.Author
  alias Oli.Course.Project
  alias Oli.Course.Family
  alias Oli.Publishing.Publication
  alias Oli.Resources
  alias Oli.Resources.Resource
  alias Oli.Resources.ResourceFamily
  alias Oli.Resources.ResourceRevision
  alias Oli.Locks

  describe "locks" do

    @valid_attrs %{}

    setup do

      {:ok, family} = Family.changeset(%Family{}, %{description: "description", slug: "slug", title: "title"}) |> Repo.insert
      {:ok, project} = Project.changeset(%Project{}, %{description: "description", slug: "slug", title: "title", version: "1", family_id: family.id}) |> Repo.insert
      {:ok, publication} = Publication.changeset(%Publication{}, %{description: "description", published: False, root_resources: [], project_id: project.id}) |> Repo.insert
      {:ok, author1} = Author.changeset(%Author{}, %{email: "test@test.com", first_name: "First", last_name: "Last", provider: "foo", system_role_id: SystemRole.role_id.author}) |> Repo.insert
      {:ok, author2} = Author.changeset(%Author{}, %{email: "test2@test.com", first_name: "First", last_name: "Last", provider: "foo", system_role_id: SystemRole.role_id.author}) |> Repo.insert
      {:ok, _institution} = Institution.changeset(%Institution{}, %{name: "CMU", country_code: "some country_code", institution_email: "some institution_email", institution_url: "some institution_url", timezone: "some timezone", consumer_key: "some key", shared_secret: "some secret", author_id: author1.id}) |> Repo.insert

      {:ok, resource_family} = ResourceFamily.changeset(%ResourceFamily{}, %{}) |> Repo.insert
      {:ok, resource} = Resource.changeset(%Resource{}, %{project_id: project.id, family_id: resource_family.id}) |> Repo.insert

      resource_type = Resources.list_resource_types() |> hd

      {:ok, revision} = ResourceRevision.changeset(%ResourceRevision{}, %{author_id: author1.id, objectives: [], resource_type_id: resource_type.id, children: [], content: [], deleted: true, slug: "some slug", title: "some title", resource_id: resource.id}) |> Repo.insert

      valid_attrs = Map.put(@valid_attrs, :publication_id, publication.id)
        |> Map.put(:resource_id, resource.id)
        |> Map.put(:revision_id, revision.id)

      {:ok, resource_mapping} = valid_attrs |> Publishing.create_resource_mapping()

      {:ok, %{mapping: resource_mapping, author1: author1, author2: author2 }}
    end

    test "acquire/3 does acquire the lock", %{author1: author1, mapping: %{ publication_id: publication_id, resource_id: resource_id }} do
      assert Locks.acquire_or_update(publication_id, resource_id, author1.id) == {:ok}
    end

    test "acquire/3 does not acquire if already acquired", %{author1: author1, author2: author2, mapping: %{ publication_id: publication_id, resource_id: resource_id }} do
      assert Locks.acquire_or_update(publication_id, resource_id, author1.id) == {:ok}

      id = author1.id

      case Locks.acquire_or_update(publication_id, resource_id, author2.id) do
        {:lock_not_acquired, {^id, _}} -> assert(true)
        _ -> assert(false)
      end
    end

    test "can acquire then release", %{author1: author1, mapping: %{ publication_id: publication_id, resource_id: resource_id }} do
      assert Locks.acquire_or_update(publication_id, resource_id, author1.id) == {:ok}
      assert Locks.release(publication_id, resource_id, author1.id) == {:ok}
    end

    test "can only release if acquired", %{author1: author1, author2: author2, mapping: %{ publication_id: publication_id, resource_id: resource_id }} do
      assert Locks.acquire_or_update(publication_id, resource_id, author1.id) == {:ok}
      assert Locks.release(publication_id, resource_id, author2.id) == {:lock_not_held}
    end

    test "updating a lock (repeated acquisition)", %{author1: author1, author2: author2, mapping: %{ publication_id: publication_id, resource_id: resource_id }} do

      assert Locks.acquire_or_update(publication_id, resource_id, author1.id) == {:ok}
      {:lock_not_acquired, {_, date1}} = Locks.acquire_or_update(publication_id, resource_id, author2.id)

      :timer.sleep(2000);

      assert Locks.acquire_or_update(publication_id, resource_id, author1.id) == {:ok}
      {:lock_not_acquired, {_, date2}} = Locks.acquire_or_update(publication_id, resource_id, author2.id)
      assert date1 != date2
    end

    test "acquiring an expired lock", %{author1: author1, author2: author2, mapping: %{ publication_id: publication_id, resource_id: resource_id }} do

      # Acquire a lock
      assert Locks.acquire_or_update(publication_id, resource_id, author1.id) == {:ok}

      # Then manually set the last_updated_at time back to yesterday
      mapping = Publishing.get_resource_mapping!(publication_id, resource_id)
      Publishing.update_resource_mapping(mapping, %{lock_updated_at: yesterday() })

      # Now verify that we can acquire it via another user
      assert Locks.acquire_or_update(publication_id, resource_id, author2.id) == {:ok}
    end


  end

  defp yesterday() do
    {:ok, datetime} = DateTime.now("Etc/UTC")
    DateTime.add(datetime, -(60 * 60 * 24), :second)
  end

end
