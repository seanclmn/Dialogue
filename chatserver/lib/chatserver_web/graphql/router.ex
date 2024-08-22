defmodule ChatserverWeb.GraphQl.Router do
  use Plug.Router
  # alias ChatserverWeb.FetchUserPlug

  plug :match
  # plug FetchUserPlug
  plug :dispatch

  forward "/graphql",
    to: Absinthe.Plug,
    init_opts: [
      schema: ChatserverWeb.GraphQl.Schema,
      analyze_complexity: true,
      max_complexity: 300
    ]

  if Mix.env() == :dev do
    forward "/graphiql",
      to: Absinthe.Plug.GraphiQL,
      init_opts: [
        schema: ChatserverWeb.GraphQl.Schema,
        socket: ChatserverWeb.UserSocket,
        socket_url: "ws://localhost:4000/api/graphql",
        interface: :playground
      ]
  end
end
