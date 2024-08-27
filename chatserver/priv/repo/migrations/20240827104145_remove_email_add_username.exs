defmodule Chatserver.Repo.Migrations.RemoveEmailAddUsername do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :username, :string
      remove :email
    end
  end
end
