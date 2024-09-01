defmodule ChatserverWeb.GraphQl.Schema do
  use Absinthe.Schema

  alias Chatserver.Accounts

  # datetime, naive_datetime, decimal
  import_types Absinthe.Type.Custom

  object :user do
    field :id, non_null(:id)
    field :username, :string
    field :inserted_at, non_null(:datetime)
    field :updated_at, non_null(:datetime)
  end

  query do
    field :user, :user do
      arg :id, non_null(:id)

      resolve fn %{id: id}, _ ->
        case Accounts.get_user(id) do
          %Accounts.User{} = user -> {:ok, user}
          _ -> {:error, :not_found}
        end
      end

    end

    field :users, list_of(:user) do
      resolve fn _, _ -> {:ok, Accounts.list_users()}
        # case Accounts.list_users do
        #   [] -> {:ok, []}
        #   users -> {:ok, users}
        # end
      end
    end
  end

  input_object :create_user_input do
    field :username, non_null(:string)
  end

  input_object :remove_user_input do
    field :id, non_null(:id)
  end

  mutation do
    field :create_user, :user do
      arg :input, non_null(:create_user_input)

      resolve fn %{input: args}, _ ->
        case Accounts.create_user(args) do
          {:ok, user} -> {:ok, user}
          {:error, _} -> nil
        end
      end
    end

    # field :remove_user, :user do
    #   arg :id, non_null(id)

    #   resolve fn %{input: args}, _ ->
    #     Accounts.delete_user(args)
    #   end
    # end
  end


  # subscription do
  # end

  # {
  #   getUser(id: 11) {
  #     username
  #   }
  # }

end
