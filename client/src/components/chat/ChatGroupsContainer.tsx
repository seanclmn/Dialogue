import { useContext, useEffect, useState } from "react";
import { ChatGroup } from "./ChatGroup";
import { CreateChat } from "@components/dialogs/CreateChat";
import { graphql } from "relay-runtime";
import { usePaginationFragment } from "react-relay";
import { Loader } from "@components/shared/loaders/Loader";
import { ChatGroupsContainer_user$key } from "@generated/ChatGroupsContainer_user.graphql";
import { UserContext } from "../../UserContext";
import img from "../../assets/logo.png"
import { CreateChatButton } from "./CreateChatButton";
import { Link } from "react-router-dom";

const fragment = graphql`
  fragment ChatGroupsContainer_user on User
  @argumentDefinitions(
    first: {type: "Int", defaultValue: 300},
    after: {type: "String"}
  )
  @refetchable(queryName: "ChatGroupsContainerRefetchQuery") {
    chats(first: $first, after: $after)
    @connection(key: "Chats_chats") {
      edges {
        cursor 
        node {
          id
          name
        }
      }
    }
  }
`

type ChatGroupsContainerProps = {
  fragmentKey: ChatGroupsContainer_user$key
}

export const ChatGroupsContainer = ({ fragmentKey }: ChatGroupsContainerProps) => {
  const [open, setOpen] = useState(false);

  const { user, setUser } = useContext(UserContext)

  const { data } = usePaginationFragment(fragment, fragmentKey)
  useEffect(() => {
    const chatIds: string[] = data.chats.edges.map((chat) => chat.node.id)
    setUser({ ...user, chatIds: chatIds })
  }, [user?.id])

  if (!data.chats) return <Loader />
  return (
    <>
      <Link to={"/"} className="cursor-pointer">
        <img src={img} className="h-14 my-2" />
      </Link>
      <CreateChatButton onClick={() => setOpen(true)} />
      <div className="flex-grow overflow-y-scroll w-full">
        {data.chats.edges.map((edge) =>
          <ChatGroup
            name={edge.node.name}
            key={edge.node.id}
            chatId={edge.node.id}
            lastMessage={"last message"}
          />)}
      </div>
      <CreateChat open={open} setIsOpen={setOpen} />
    </>
  );
};