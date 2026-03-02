import { useContext } from "react";
import { NotificationsList_user$key } from "@generated/NotificationsList_user.graphql";
import { usePaginationFragment, graphql } from "react-relay";
import { FriendRequest } from "@components/notifications/FriendRequest";
import { UserContext } from "@contexts/UserContext";

const fragment = graphql`
  fragment NotificationsList_user on User
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 20 }
    cursor: { type: "String" }
  )
  @refetchable(queryName: "NotificationsListPaginationRefetchQuery") {
    id
    notifications(first: $first, after: $cursor)
      @connection(key: "NotificationsList_notifications") {
      edges {
        cursor
        node {
          __typename
          id
          createdAt
          ... on FriendRequestNotification {
            sender {
              username
              id
            }
            receiver {
              username
              id
            }
            accepted
            declined
            friendRequestId
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const NotificationsContent = ({ fragmentKey }: { fragmentKey: NotificationsList_user$key }) => {
  const { hasNext, loadNext, data } = usePaginationFragment(fragment, fragmentKey);

  if (!data.notifications || data.notifications.edges.length === 0) {
    return (
      <div className="p-4 bg-bgd-color text-txt-color min-h-full w-full">
        <h1>No new Notifications!</h1>
      </div>
    );
  }

  return (
    <div className="bg-bgd-color text-txt-color min-h-full w-full flex flex-col">
      <div className="divide-y divide-brd-color">
        {data.notifications.edges.map(({ node }) => {
          const renderNotificationContent = () => {
            switch (node.__typename) {
              case "FriendRequestNotification":
                return (
                  <FriendRequest
                    data={{
                      accepted: node.accepted ?? false,
                      declined: node.declined ?? false,
                      friendRequestId: node.friendRequestId ?? "",
                      notificationId: node.id,
                      sender: node.sender!,
                    }}
                  />
                );
              default:
                return (
                  <div className="p-4">
                    <p className="text-sm">New notification: {node.id}</p>
                  </div>
                );
            }
          };

          return <div key={node.id}>{renderNotificationContent()}</div>;
        })}
      </div>

      {hasNext && (
        <button
          onClick={() => loadNext(20)}
          className="bg-primary text-white px-4 py-2 rounded-md m-4 self-center text-sm font-medium"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export const Notifications = () => {
  const { currentUserRef } = useContext(UserContext);

  if (!currentUserRef) return null;

  return <NotificationsContent fragmentKey={currentUserRef as NotificationsList_user$key} />;
};
