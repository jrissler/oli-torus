defmodule Oli.Repo.Migrations.ParentCourse do
  use Ecto.Migration

  def change do
    alter table(:projects) do
      add :parent_project_id, references(:projects)
    end
  end
end
