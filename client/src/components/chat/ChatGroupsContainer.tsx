import { useContext, useEffect, useState } from "react";
import { Button } from "../shared/Buttons/GenericButton";
import { ChatGroup } from "./ChatGroup";
import { useCookies } from "react-cookie";
import { CreateChat } from "@components/dialogs/CreateChat";
import { graphql } from "relay-runtime";
import { usePaginationFragment } from "react-relay";
import { Loader } from "@components/shared/loaders/Loader";
import { ChatGroupsContainer_user$key } from "@generated/ChatGroupsContainer_user.graphql";
import { UserContext } from "../../UserContext";

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
  const [, removeCookie] = useCookies(['accessToken'])
  const [open, setOpen] = useState(false);

  const { user, setUser } = useContext(UserContext)

  const { data } = usePaginationFragment(fragment, fragmentKey)
  console.log(data)
  useEffect(() => {
    const chatIds: string[] = data.chats.edges.map((chat) => chat.node.id)
    console.log(chatIds)
    setUser({ ...user, chatIds: chatIds })
  }, [user?.id])

  if (!data.chats) return <Loader />
  return (
    <>
      <div className="absolute h-10 flex items-center justify-center px-4">
        <p>Chats</p>
      </div>
      <div className="mt-12">
        {data.chats.edges.map((edge) => <ChatGroup name={edge.node.name} key={edge.node.id} chatId={edge.node.id} />)}
      </div>
      <Button title="Log Out" styles="mt-auto" onClick={(e) => {
        e.preventDefault()
        removeCookie("accessToken", null)
      }}
      />
      <Button onClick={() => setOpen(true)} title="create chat" />
      <CreateChat open={open} setIsOpen={setOpen} />
    </>
  );
};