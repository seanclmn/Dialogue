import { RelayEnvironmentProvider } from "react-relay";
import { PropsWithChildren } from "react";
import { useCookies } from "react-cookie";

import { Environment, FetchFunction, Network, Observable, RecordSource, Store } from "relay-runtime";

export const RelayProvider = ({ children }: PropsWithChildren) => {
  const [cookies,] = useCookies(['accessToken']);
  const HTTP_ENDPOINT = "http://localhost:3000/graphql";

  const fetchFunction: FetchFunction = (params, variables) => {
    const response = fetch(HTTP_ENDPOINT, {
      method: "POST",
      headers: {
        'Authorization': `bearer ${cookies["accessToken"]}`,
        'Content-Type': 'application/json',
      }, body: JSON.stringify({
        query: params.text,
        variables,
      }),
    })

    return Observable.from(response.then((data) => {
      return data.json()
    }));
  };

  function createEnvironment() {
    const network = Network.create(fetchFunction);
    const store = new Store(new RecordSource());
    return new Environment({ store, network });
  }

  const environment = createEnvironment();

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  )
}