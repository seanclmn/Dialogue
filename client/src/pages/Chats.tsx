import { ChatGroupsContainer } from "@components/chat/ChatGroupsContainer";
import { EmptyChat } from "@components/chat/EmptyChat";
import { Loader } from "@components/shared/loaders/Loader";
import { Suspense, useEffect } from "react";
import { Outlet, useParams } from "react-router";
import { graphql } from "relay-runtime";
import { PreloadedQuery, usePreloadedQuery, useQueryLoader } from "react-relay";
import { ChatsQuery } from "@generated/ChatsQuery.graphql";

const query = graphql`
  query ChatsQuery {
    currentUser {
      ...ChatGroupsContainer_user
    }
  }
`;

interface ChatsProps {
  queryReference: PreloadedQuery<ChatsQuery>;
}

const Content = ({ queryReference }: ChatsProps) => {
  const { id: chatId } = useParams();
  const data = usePreloadedQuery<ChatsQuery>(query, queryReference);

  if (!data.currentUser) return <Loader />;

  return (
    <>
      <Suspense fallback={<Loader />}>
        <ChatGroupsContainer fragmentKey={data.currentUser} />
      </Suspense>
      <div className="w-full h-full flex-grow relative">
        {chatId ? <Outlet /> : <EmptyChat />}
      </div>
    </>
  );
};

export const Chats = () => {
  const [queryReference, loadQuery] = useQueryLoader<ChatsQuery>(query);

  useEffect(() => {
    loadQuery({});
  }, []);

  if (!queryReference) return null;

  return (
    <Suspense fallback={<div />}>
      <Content queryReference={queryReference} />
    </Suspense>
  );
};
