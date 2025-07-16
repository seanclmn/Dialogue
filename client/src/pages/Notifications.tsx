import { NotificationsQuery } from "@generated/NotificationsQuery.graphql";
import { useContext, useEffect } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { UserContext } from "@contexts/UserContext";
import { FriendRequest } from "@components/notifications/FriendRequest";

const query = graphql`
  query NotificationsQuery($receiverId: String!) {
    currentUser {
      friendRequests(receiverId: $receiverId) {
        accepted
        declined
        id
        sender {
          id
          username
        }
      }
    }
  }
`;

type ContentProps = {
  queryReference: PreloadedQuery<NotificationsQuery>;
};

const Content = ({ queryReference }: ContentProps) => {

  const data = usePreloadedQuery(query, queryReference);

  return (
    <>
      {data.currentUser.friendRequests.length === 0 && (
        <p className="text-center text-txt-color p-4">No New notifications!</p>
      )}

      {data.currentUser.friendRequests.map((friendRequest) => (
        <FriendRequest key={friendRequest.id} data={friendRequest} />
      ))}
    </>
  );
};

export const Notifications = () => {
  const data = useContext(UserContext);
  const [queryReference, loadQuery] = useQueryLoader<NotificationsQuery>(query);

  useEffect(() => {
    if (data.user.id) {
      loadQuery({ receiverId: data.user.id });
    }
  }, [data.user.id]);

  if (!queryReference) return null;

  return <Content queryReference={queryReference} />;
};
