// @ts-nocheck

import { RelayEnvironmentProvider } from "react-relay";
import { PropsWithChildren } from "react";
import { useCookies } from "react-cookie";

import {
  Environment,
  FetchFunction,
  Network,
  Observable,
  PayloadData,
  RecordSource,
  Store,
  SubscribeFunction,
} from "relay-runtime";
import { createClient, ExecutionResult, Sink } from "graphql-ws";
import { PayloadExtensions } from "relay-runtime/lib/network/RelayNetworkTypes";

export const RelayProvider = ({ children }: PropsWithChildren) => {
  const [cookies, , removeCookie] = useCookies(["accessToken"]);
  const HTTP_ENDPOINT = "http://localhost:3000/graphql";

  const wsClient = createClient({
    url: "ws://localhost:3000/graphql",
    connectionParams: () => ({
      Authorization: cookies["accessToken"] ? `Bearer ${cookies["accessToken"]}` : undefined,
    }),
  });

  const subscribe: SubscribeFunction = (operation, variables) => {
    return Observable.create(
      (sink: Sink<ExecutionResult<PayloadData | null, PayloadExtensions>>) => {
        return wsClient.subscribe(
          {
            operationName: operation.name,
            query: operation.text ?? "",
            variables,
          },
          sink,
        );
      },
    );
  };

  const fetchFunction: FetchFunction = (params, variables) => {
    const response = fetch(HTTP_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `bearer ${cookies["accessToken"]}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: params.text,
        variables,
      }),
    });

    return Observable.from(
      response.then(async (data) => {
        const json = await data.json()
        if (json?.errors?.some((err) => err.message === "Unauthorized")) {
          removeCookie("accessToken", { path: "/" })
        }
        return json;
      }),
    );
  };

  function createEnvironment() {
    const network = Network.create(fetchFunction, subscribe);
    const store = new Store(new RecordSource());
    return new Environment({ store, network });
  }

  const environment = createEnvironment();

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
};
