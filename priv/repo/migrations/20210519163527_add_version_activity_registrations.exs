defmodule Oli.Repo.Migrations.AddVersionActivityRegistrations do
  use Ecto.Migration

  def change do
    alter table(:activity_registrations) do
      add :version, :integer, default: 1
    end
  end
end
