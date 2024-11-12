import { Suspense, useEffect, useState } from "react";
import { Button } from "../shared/Buttons/GenericButton";
import { ChatGroup } from "./ChatGroup";
import { useCookies } from "react-cookie";
import { CreateChat } from "@components/dialogs/CreateChat";
import { graphql } from "relay-runtime";
import { PreloadedQuery, usePreloadedQuery, useQueryLoader } from "react-relay";
import { ChatGroupsContainerQuery } from "@generated/ChatGroupsContainerQuery.graphql";
import { Loader } from "@components/shared/loaders/Loader";

const query = graphql`
  query ChatGroupsContainerQuery {
    currentUser {
      chats {
        name
        id
      }
    }
  }
`

type ContentProps = {
  queryReference: PreloadedQuery<ChatGroupsContainerQuery>
}

export const Content = ({ queryReference }: ContentProps) => {
  const [, removeCookie] = useCookies(['accessToken'])
  const [open, setOpen] = useState(false);

  const { chats } = usePreloadedQuery(query, queryReference).currentUser

  if (!chats) return <Loader />
  return (
    <>
      <div className="absolute h-10 flex items-center justify-center px-4">
        <p>Chats</p>
      </div>
      {chats.map((chat) => <ChatGroup name={chat.name} key={chat.id} />)}
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

export const ChatGroupsContainer = () => {
  const [queryReference, loadQuery] = useQueryLoader<ChatGroupsContainerQuery>(query);

  useEffect(() => {
    loadQuery({})
  }, [])

  if (!queryReference) return null
  return (
    <Suspense fallback={<div />}>
      <Content queryReference={queryReference} />
    </Suspense>
  )

}
