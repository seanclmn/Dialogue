import { ChatGroup } from "@components/chat/ChatGroup";
import { CreateChat } from "@components/dialogs/CreateChat";
import { EmptyChat } from "@components/chat/EmptyChat";
import { Loader } from "@components/shared/loaders/Loader";
import { useContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import { graphql } from "relay-runtime";
import { usePaginationFragment } from "react-relay";
import { Chats_user$key } from "@generated/Chats_user.graphql";
import { UserContext } from "@contexts/UserContext";
import { Suspense } from "react";

const fragment = graphql`
  fragment Chats_user on User
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
  )
  @refetchable(queryName: "ChatsRefetchQuery") {
    chats(first: $first, after: $after) @connection(key: "Chats_chats") {
      edges {
        cursor
        node {
          id
          name
          lastMessage {
            text
            userId
          }
        }
      }
    }
  }
`;

type ChatsContentProps = {
  fragmentKey: Chats_user$key;
};

const ChatsContent = ({ fragmentKey }: ChatsContentProps) => {
  const { id: chatId } = useParams();
  const [open, setOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { data } = usePaginationFragment(fragment, fragmentKey);

  useEffect(() => {
    const chatIds: string[] = data.chats.edges.map(
      (chat) => chat.node.id
    );
    setUser({ ...user, chatIds });
  }, [user?.id]);

  if (!data.chats) return <Loader />;

  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className="border-brd-color border-r-[1px] w-16 min-w-0 shrink-0 md:w-60 md:min-w-60 h-full flex flex-col items-center">
          {data.chats.edges.length > 0 ? (
            <div className="overflow-auto w-full h-full">
              {data.chats.edges.map((edge) => (
                <ChatGroup
                  name={edge.node.name}
                  key={edge.node.id}
                  chatId={edge.node.id}
                  lastMessage={edge.node.lastMessage}
                />
              ))}
            </div>
          ) : null}
          <CreateChat open={open} setIsOpen={setOpen} />
        </div>
      </Suspense>
      <div className="w-full h-full flex-grow relative">
        {chatId ? <Outlet /> : <EmptyChat />}
      </div>
    </>
  );
};

export const Chats = () => {
  const { currentUserRef } = useContext(UserContext);

  if (!currentUserRef) return <Loader />;

  return <ChatsContent fragmentKey={currentUserRef as Chats_user$key} />;
};
