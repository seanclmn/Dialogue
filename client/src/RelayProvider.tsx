// @ts-nocheck

import { RelayEnvironmentProvider } from "react-relay";
import { PropsWithChildren, useMemo } from "react";
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
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const HTTP_ENDPOINT = "http://localhost:3000/graphql";

  const wsClient = useMemo(
    () =>
      createClient({
        url: "ws://localhost:3000/graphql",
        connectionParams: () => {
          const token = cookies["accessToken"];
          if (token && token !== "undefined" && token !== "null") {
            return { Authorization: `Bearer ${token}` };
          }
          return {};
        },
      }),
    [cookies["accessToken"]],
  );

  const subscribe: SubscribeFunction = useMemo(
    () => (operation, variables) => {
      return Observable.create(
        (
          sink: Sink<ExecutionResult<PayloadData | null, PayloadExtensions>>,
        ) => {
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
    },
    [wsClient],
  );

  const fetchFunction: FetchFunction = useMemo(
    () => (params, variables) => {
      const token = cookies["accessToken"];
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token && token !== "undefined" && token !== "null") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = fetch(HTTP_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: params.text,
          variables,
        }),
      });

      return Observable.from(
        response.then(async (data) => {
          const json = await data.json();
          const isUnauthorized = json?.errors?.some(
            (err: any) =>
              err.message === "Unauthorized" ||
              err.extensions?.status === 401 ||
              err.extensions?.code === "UNAUTHORIZED",
          );

          if (isUnauthorized) {
            removeCookie("accessToken", { path: "/" });
            window.location.href = "/login";
          }
          return json;
        }),
      );
    },
    [cookies["accessToken"], removeCookie],
  );

  const environment = useMemo(() => {
    const network = Network.create(fetchFunction, subscribe);
    const store = new Store(new RecordSource());
    return new Environment({ store, network });
  }, [fetchFunction, subscribe]);

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
};
