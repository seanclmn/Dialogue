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
import { getChatDisplayName, getDMAvatar } from "@utils/chatName";

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
          participants {
            user {
              id
              username
              avatarUrl
            }
            lastReadMessage {
              id
            }
          }
          lastMessage {
            id
            text
            userId
            username
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
  const { user, setUser, setUnreadChatCount } = useContext(UserContext);
  const { data } = usePaginationFragment(fragment, fragmentKey);

  useEffect(() => {
    const chatIds: string[] = data.chats.edges.map((chat) => chat.node.id);
    setUser({ ...user, chatIds });
  }, [user?.id]);

  const unreadCount = data.chats.edges.filter(({ node }) => {
    const myParticipant = node.participants?.find((p) => p.user.id === user.id);
    if (!node.lastMessage) return false;
    return myParticipant?.lastReadMessage?.id !== node.lastMessage.id;
  }).length;

  useEffect(() => {
    setUnreadChatCount(unreadCount);
  }, [unreadCount]);

  if (!data.chats) return <Loader />;

  return (
    <>
      <div className="border-brd-color border-r-[1px] w-16 min-w-0 shrink-0 md:w-60 md:min-w-60 h-full flex flex-col items-center">
        <Suspense fallback={<Loader />}>
          {data.chats.edges.length > 0 ? (
            <div className="overflow-auto w-full h-full">
              {data.chats.edges.map((edge) => {
                const participants = edge.node.participants ?? [];
                const myParticipant = participants.find((p) => p.user.id === user.id);
                const hasUnread =
                  !!edge.node.lastMessage &&
                  myParticipant?.lastReadMessage?.id !== edge.node.lastMessage.id;
                return (
                  <ChatGroup
                    name={getChatDisplayName(
                      edge.node.name,
                      participants.map((p) => p.user.username),
                      user.username
                    )}
                    avatarUrl={getDMAvatar(participants.map((p) => p.user), user.id)}
                    key={edge.node.id}
                    chatId={edge.node.id}
                    lastMessage={edge.node.lastMessage}
                    hasUnread={hasUnread}
                  />
                );
              })}
            </div>
          ) : null}
          <CreateChat open={open} setIsOpen={setOpen} />
        </Suspense>
      </div>
      <Suspense fallback={<Loader />}>
        <div className="w-full h-full flex-grow relative">
          {chatId ? <Outlet /> : <EmptyChat onNewChat={() => setOpen(true)} />}
        </div>
      </Suspense>
    </>
  );
};

export const Chats = () => {
  const { currentUserRef } = useContext(UserContext);

  if (!currentUserRef) return <Loader />;

  return <ChatsContent fragmentKey={currentUserRef as Chats_user$key} />;
};
