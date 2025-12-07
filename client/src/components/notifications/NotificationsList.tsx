import { NotificationsList_user$key } from "@generated/NotificationsList_user.graphql";
import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";

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
  const data = usePaginationFragment(fragment, fragmentKey)
  console.log(data)
  return (
    <div>

    </div>
  )
}