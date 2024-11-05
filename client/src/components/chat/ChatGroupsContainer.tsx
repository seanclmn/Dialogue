import { useState } from "react";
import { Button } from "../shared/Buttons/GenericButton";
import { ChatGroup } from "./ChatGroup";
import { useCookies } from "react-cookie";
import { CreateChat } from "@components/dialogs/CreateChat";
import { graphql } from "relay-runtime";
import { useLazyLoadQuery } from "react-relay";

const query = graphql`
  query ChatGroupsContainerQuery {
      chats {
        id
        name
        participants {
          id
          username
        }
      }
    
  }
`

export const ChatGroupsContainer = () => {
  const [, removeCookie] = useCookies(['accessToken'])
  const [open, setOpen] = useState(false);

  const data = useLazyLoadQuery(query, {})

  console.log(data)
  return (
    <>
      <div className="absolute h-10 flex items-center justify-center px-4">
        <p>Chats</p>
      </div>
      <ChatGroup />
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
