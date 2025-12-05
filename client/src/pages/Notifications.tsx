import { useContext, useEffect } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { UserContext } from "@contexts/UserContext";
import { FriendRequest } from "@components/notifications/FriendRequest";
import { NotificationsPaginationRefetchQuery } from "@generated/NotificationsPaginationRefetchQuery.graphql";
import { NotificationsQuery } from "@generated/NotificationsQuery.graphql";

const query = graphql`
  query NotificationsQuery {
      currentUser {
        ...Notifications_user
      }
    }
`

const fragment = graphql`
  fragment Notifications_user on User
  @argumentDefinitions(
    first: {type: "Int", defaultValue: 20}
    after: { type: "String"}
  )
  @refetchable(queryName: "NotificationsPaginationRefetchQuery"){
    notifications(first: $first, after: $after) 
      @connection(key: "Notifications_notifications") {
        edges {
          cursor
          node {
            id
          }
        }
        
        pageInfo {
          endCursor
          hasNextPage
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
  const [queryReference, loadQuery] = useQueryLoader<NotificationsQuery>(fragment);

  useEffect(() => {
    if (data.user.id) {
      loadQuery({});
    }
  }, [data.user.id]);

  if (!queryReference) return null;

  return <Content queryReference={queryReference} />;
};
