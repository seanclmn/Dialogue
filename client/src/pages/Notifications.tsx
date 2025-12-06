import { useContext, useEffect } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { UserContext } from "@contexts/UserContext";
import { NotificationsQuery } from "@generated/NotificationsQuery.graphql";
import { NotificationsList } from "@components/notifications/NotificationsList";

const query = graphql`
  query NotificationsQuery {
      currentUser {
        ...NotificationsList_user
      }
    }
`

type ContentProps = {
  queryReference: PreloadedQuery<NotificationsQuery>;
};

const Content = ({ queryReference }: ContentProps) => {

  const data = usePreloadedQuery<NotificationsQuery>(query, queryReference);

  if (!data.currentUser) return null
  return (
    <NotificationsList fragmentKey={data.currentUser} />
  );
};

export const Notifications = () => {
  const data = useContext(UserContext);
  const [queryReference, loadQuery] = useQueryLoader<NotificationsQuery>(query);

  useEffect(() => {
    if (data.user.id) {
      loadQuery({});
    }
  }, [data.user.id]);

  if (!queryReference) return null;

  return <Content
    queryReference={queryReference}
  />;
};
