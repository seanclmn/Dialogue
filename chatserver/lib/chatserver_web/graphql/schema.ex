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

      resolve fn %{id: id}, _ -> 
        case Accounts.get_user(id) do
          %Accounts.User{} = user -> {:ok, user}
          _ -> {:ok, Accounts.get_user(id)} 
        end
      end
    end
  end

  input_object :create_user_input do
    field :id, non_null(:id)
    field :email, non_null(:string)
  end

  mutation do
    field :create_user, :user do
      arg :input, non_null(:create_user_input)

      resolve fn %{input: args}, _ -> 
        case Accounts.create_user(args) do
          {:ok, user} -> {:ok, user}
          {:error, changeset} -> {:error, changeset}
        end
      end
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
