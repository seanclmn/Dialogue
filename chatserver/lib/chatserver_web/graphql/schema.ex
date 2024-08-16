defmodule ChatserverWeb.GraphQl.Schema do
  use Absinthe.Schema

  alias Chatserver.Accounts

  # datetime, naive_datetime, decimal
  import_types Absinthe.Type.Custom

  object :user do
    field :id, non_null(:id)
    field :email, :string
    field :inserted_at, non_null(:datetime)
    field :updated_at, non_null(:datetime)

  end

  query do
    field :get_user, :user do
      arg :id, non_null(:id)

      resolve fn %{id: id}, _ -> {:ok, Accounts.get_user(id)} end
    end
  end

  # mutation do
  # end

  # subscription do
  # end
end
