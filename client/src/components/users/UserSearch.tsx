import { Input } from "@components/shared/Inputs/GenericInput";
import { UserSearchQuery } from "@generated/UserSearchQuery.graphql";
import { useCallback, useEffect, useState } from "react";
import { useRelayEnvironment } from "react-relay";
import { fetchQuery, graphql } from "relay-runtime";
import { UserSearchItem } from "./UserSearchItem";

const query = graphql`
  query UserSearchQuery($username: String!) {
    users(username: $username) {
      id
      username
    }
  }
`;

export const UserSearch = () => {
  const env = useRelayEnvironment();
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [res, setRes] = useState<
    ReadonlyArray<{ id: string; username: string }>
  >([]);

  const fetch = useCallback(
    (username: string) => {
      if (username === "") return null;
      return fetchQuery<UserSearchQuery>(env, query, { username: username })
        .toPromise()
        .then((result) => result);
    },
    [input],
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setIsTyping(false);
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [isTyping]);

  return (
    <>
      <Input
        title={"search users"}
        onChange={async (e) => {
          setInput(e.currentTarget.value);
          const result = await fetch(e.currentTarget.value);
          if (result?.users) {
            setRes(result.users);
            return;
          }
          setRes([]);
        }}
      />
      {res.length > 0 ? (
        res.map((user) => (
          <UserSearchItem id={user.id} username={user.username} />
        ))
      ) : (
        <>
          {input ? (
            <div className="w-full flex flex-col items-center py-4">
              <p>No users with that username...</p>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};
