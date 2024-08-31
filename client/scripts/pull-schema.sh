#!/bin/bash

cd ../chatserver

mix deps.get && mix absinthe.schema.sdl --schema ChatserverWeb.GraphQl.Schema ../client/schema.graphql

