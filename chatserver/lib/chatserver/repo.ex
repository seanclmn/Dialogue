defmodule Chatserver.Repo do
  use Ecto.Repo,
    otp_app: :chatserver,
    adapter: Ecto.Adapters.Postgres
end
