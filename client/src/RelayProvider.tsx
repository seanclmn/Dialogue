import { RelayEnvironmentProvider } from "react-relay";
import React, { ComponentType, PropsWithChildren } from "react";
import type { Environment as RelayEnvironment } from "relay-runtime";
import { useCookies } from "react-cookie";

import {
  Environment,
  FetchFunction,
  Network,
  Observable,
  RecordSource,
  Store,
  SubscribeFunction,
} from "relay-runtime";
import { createClient, Sink } from "graphql-ws";
import { API_ORIGIN } from "./config";

const GRAPHQL_PATH = "/graphql";
const HTTP_ENDPOINT = `${API_ORIGIN.replace(/\/$/, "")}${GRAPHQL_PATH}`;
const wsUrl = (() => {
  try {
    const u = new URL(API_ORIGIN);
    const wsProtocol = u.protocol === "https:" ? "wss:" : "ws:";
    return `${wsProtocol}//${u.host}${GRAPHQL_PATH}`;
  } catch {
    return `ws://localhost:8080${GRAPHQL_PATH}`;
  }
})();

type CookieState = { accessToken?: string };

export const RelayProvider = ({ children }: PropsWithChildren) => {
  const [cookies, , removeCookie] = useCookies<"accessToken", CookieState>(["accessToken"]);

  const wsClient = createClient({
    url: wsUrl,
    connectionParams: () => {
      const token = cookies.accessToken;
      if (token && token !== "undefined" && token !== "null") {
        return { Authorization: `Bearer ${token}` };
      }
      return {};
    },
  });

  const subscribe: SubscribeFunction = (operation, variables) => {
    return Observable.create((sink) => {
      return wsClient.subscribe(
        {
          operationName: operation.name,
          query: operation.text ?? "",
          variables,
        },
        sink as unknown as Sink<Record<string, unknown>>,
      );
    });
  };

  const fetchFunction: FetchFunction = (params, variables) => {
    const token = cookies.accessToken;
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
        const isUnauthorized = (json?.errors as Array<{ message?: string; extensions?: { status?: number; code?: string } }> | undefined)?.some(
          (err) =>
            err.message === "Unauthorized" ||
            err.extensions?.status === 401 ||
            err.extensions?.code === "UNAUTHORIZED",
        );

        if (isUnauthorized && cookies.accessToken) {
          removeCookie("accessToken", { path: "/" });
          window.location.href = "/login";
        }
        return json;
      }),
    );
  };

  const network = Network.create(fetchFunction, subscribe);
  const store = new Store(new RecordSource());
  const environment = new Environment({ store, network });

  const EnvProvider = RelayEnvironmentProvider as ComponentType<{
    environment: RelayEnvironment;
    children: React.ReactNode;
  }>;

  return <EnvProvider environment={environment}>{children}</EnvProvider>;
};
