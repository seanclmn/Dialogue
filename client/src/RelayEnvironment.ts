import { useCookies } from "react-cookie";
import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
} from "relay-runtime";

const HTTP_ENDPOINT = "http://localhost:3000/graphql";

const fetchFn: FetchFunction = async (request, variables) => {
  const [cookies] = useCookies(['accessToken']);

  const resp = await fetch(HTTP_ENDPOINT, {
    method: "POST",
    headers: {
      'Authorization': `bearer ${cookies["accessToken"]}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: request.text, // <-- The GraphQL document composed by Relay
      variables,
    }),
  });

  return await resp.json();
};

function createRelayEnvironment() {
  return new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
}

export const RelayEnvironment = createRelayEnvironment();
