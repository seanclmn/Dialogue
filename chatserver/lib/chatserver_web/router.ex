defmodule ChatserverWeb.Router do

  use ChatserverWeb, :router

  scope "/", ChatserverWeb do
    forward "/api", GraphQl.Router
  end
end
