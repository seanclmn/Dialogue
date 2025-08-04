import { useContext, useEffect, useState } from "react";
import { ChatGroup } from "./ChatGroup";
import { CreateChat } from "@components/dialogs/CreateChat";
import { graphql } from "relay-runtime";
import { usePaginationFragment } from "react-relay";
import { Loader } from "@components/shared/loaders/Loader";
import { ChatGroupsContainer_user$key } from "@generated/ChatGroupsContainer_user.graphql";
import { UserContext } from "../../contexts/UserContext";

const fragment = graphql`
  fragment ChatGroupsContainer_user on User
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
  )
  @refetchable(queryName: "ChatGroupsContainerRefetchQuery") {
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

type ChatGroupsContainerProps = {
  fragmentKey: ChatGroupsContainer_user$key;
};

export const ChatGroupsContainer = ({
  fragmentKey,
}: ChatGroupsContainerProps) => {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { data } = usePaginationFragment(fragment, fragmentKey);

  useEffect(() => {
    const chatIds: string[] = data.chats.edges.map((chat) => chat.node.id);
    setUser({ ...user, chatIds: chatIds });
  }, [user?.id]);

  if (!data.chats) return <Loader />;

  if (data.chats.edges.length === 0) return null;

  return (
    <div className="border-brd-color border-r-[1px] min-w-60 h-full flex flex-col items-center">
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
      <CreateChat open={open} setIsOpen={setOpen} />
    </div>
  );
};
