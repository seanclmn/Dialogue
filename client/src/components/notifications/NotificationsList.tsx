import { NotificationsList_user$key } from "@generated/NotificationsList_user.graphql";
import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Avatar } from "@components/shared/users/Avatar";
import img from "../../assets/jennie.jpeg";

const fragment = graphql`
  fragment NotificationsList_user on User
  @argumentDefinitions(
    first: {type: "Int", defaultValue: 20}
    cursor: { type: "String"}
  )
  @refetchable(queryName: "NotificationsListPaginationRefetchQuery"){
    notifications(first: $first, after: $cursor) 
      @connection(key: "NotificationsList_notifications") {
        edges {
          cursor
          node {
            id
            type
            createdAt
            sender {
              username
              id
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

interface NotificationsList {
  fragmentKey: NotificationsList_user$key
}

export const NotificationsList = ({ fragmentKey }: NotificationsList) => {
  const { hasNext, loadNext, data } = usePaginationFragment(
    fragment,
    fragmentKey
  );

  if (!data.notifications || data.notifications.edges.length === 0)
    return <NoNotifications />;

  return (
    <div className="bg-bgd-color text-txt-color min-h-full w-full flex flex-col">
      <div className="divide-y divide-brd-color">
        {data.notifications?.edges.map(({ node }) => {
          const date = new Date(node.createdAt).toLocaleDateString();

          const renderNotificationContent = () => {
            switch (node.type) {
              case "FRIENDREQUEST":
                return (
                  <div className="flex items-center gap-3 p-4 hover:bg-bgd-highlight transition-colors">
                    <Avatar src={img} containerStyle="w-10 h-10" />
                    <div className="flex flex-col flex-1">
                      <p className="text-sm">
                        <span className="font-bold">{node.sender.username}</span>{" "}
                        sent you a friend request.
                      </p>
                      <p className="text-xs text-gray-500">{date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs bg-primary text-white px-3 py-1 rounded-md font-medium">
                        Accept
                      </button>
                      <button className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-md font-medium">
                        Decline
                      </button>
                    </div>
                  </div>
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

const NoNotifications = () => {
  return (
    <div className="p-4 bg-bgd-color text-txt-color min-h-full w-full">
      <h1>No new Notifications!</h1>
    </div>
  )
}
