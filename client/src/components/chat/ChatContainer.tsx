import { Suspense, useContext, useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Message, MessageProps } from "../shared/Messages/Message";
import { ChatInput } from "../shared/Inputs/ChatInput";
import { ChatSendButton } from "../shared/Buttons/ChatSendButton";
import { Typing } from "./Typing";
import { Avatar } from "../shared/users/Avatar";
import img from "../../assets/jennie.jpeg";
import { Loader } from "../shared/loaders/Loader";
import { ConnectionHandler, graphql, GraphQLSubscriptionConfig } from "relay-runtime";
import { PreloadedQuery, useMutation, usePreloadedQuery, useQueryLoader, useSubscription } from "react-relay";
import { ChatContainerQuery } from "@generated/ChatContainerQuery.graphql";
import { ChatContainerMutation } from "@generated/ChatContainerMutation.graphql";
import { UserContext } from "../../UserContext";
import { Messages } from "./Messages";
import { useParams } from "react-router";
import { ChatHeader } from "./ChatHeader";

const query = graphql`
  query ChatContainerQuery($id:ID!) {
    node(id: $id){
      ... on Chat {
        id
        name      
        ...Messages_chat
      }
    }
  }
`

const mutation = graphql`
  mutation ChatContainerMutation($text: String!, $userId: String!, $chatId: String!) {
    createMessage(createMessageInput:{text: $text, userId: $userId, chatId: $chatId}){
      createdAt
      id 
      text 
      userId 
    }
  }
`


interface ContentProps {
  queryReference: PreloadedQuery<ChatContainerQuery>;
  chatId: string;
}


export const Content = ({ queryReference, chatId }: ContentProps) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<MessageProps[]>([]);
  const { user } = useContext(UserContext)
  const [commitMutation, isMutationInFlight] = useMutation<ChatContainerMutation>(mutation)

  const data = usePreloadedQuery(query, queryReference)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setIsTyping(false);
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [isTyping]);

  return (
    <div className="h-full flex flex-col justify-between">
      <ChatHeader title={data.node?.name ?? "(unnamed chat)"} style="absolute" />

      <div className="flex flex-col items-start grow overflow-auto mt-11 px-2 pt-4">
        {data.node ? <Messages fragmentKey={data.node} /> : null}
        {isTyping ? (
          <div className="flex flex-row">
            <Avatar src={img} />
            <Typing />
          </div>
        ) : null}
      </div>
      <form
        className="border-[1px] rounded-[15px] 
         my-2 px-[1rem] py-[4px] 
        border-black flex items-center
        "
        onSubmit={(e: React.KeyboardEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (message.length > 0) {
            setConversation([
              ...conversation,
              { text: message, id: uuidv4(), senderIsMe: true },
            ]);
            setMessage("");
            setIsTyping(false);
          }
        }}
      >
        <ChatInput
          value={message}
          onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
            setIsTyping(true);
            e.preventDefault();
            setMessage(e.currentTarget.value);
          }}
        />
        <ChatSendButton disabled={message.length === 0} onClick={() => {
          if (user?.id) {
            commitMutation({
              variables: {
                text: message,
                userId: user.id,
                chatId: chatId
              }
            }).dispose()
            setMessage("")
          }
        }} />
      </form>
    </div>
  );
};

export const ChatContainer = () => {
  const { id } = useParams()
  const [queryReference, loadQuery] = useQueryLoader<ChatContainerQuery>(query);

  useEffect(() => {
    if (id)
      loadQuery({ id: id })
  }, [id])

  if (!id) return null
  if (!queryReference) return <Loader />

  return (
    <Suspense>
      <Content queryReference={queryReference} chatId={id} />
    </Suspense>
  )
}