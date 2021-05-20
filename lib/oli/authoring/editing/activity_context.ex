defmodule Oli.Authoring.Editing.ActivityContext do
  @derive Jason.Encoder
  defstruct [
    :authoringScript,
    :authoringElement,
    :friendlyName,
    :description,
    :authorEmail,
    :projectSlug,
    :resourceId,
    :resourceSlug,
    :resourceTitle,
    :activityId,
    :activitySlug,
    :title,
    :model,
    :objectives,
    :allObjectives,
    :editorMap
  ]

  def prepare_model(model, activity_type, _opts \\ []) do
    upversion(model, activity_type)
  end

  def upversion(model, activity_type) do
    model
  end
end
