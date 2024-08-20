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

  mutation do
    field :create_user, :user do
      arg :id, non_null(:id)
      arg :email, :string

      resolve fn %{id: id, email: email}, _ -> {:ok, Accounts.create_user(id,email)} end
    end
  end

  # subscription do
  # end

  # {
  #   getUser(id: 11) {
  #     email
  #   }
  # }
  
end
