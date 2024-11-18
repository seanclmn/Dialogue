import { Suspense, useContext, useEffect, useMemo, useState } from "react";
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
import { ChatContainerSubscription, ChatContainerSubscription$data } from "@generated/ChatContainerSubscription.graphql";
import { Messages } from "./Messages";
import { useParams } from "react-router";

const query = graphql`
  query ChatContainerQuery($id:ID!) {
    node(id: $id){
      ... on Chat {
        id
        name      
        participants {
          username
          id
        }
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

const subscription = graphql`
  subscription ChatContainerSubscription($chatId: String!) {
    addMessage(chatId: $chatId) {
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
  const [newMessages, setNewMessages] = useState<ChatContainerSubscription$data["addMessage"][]>([])
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setIsTyping(false);
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [isTyping]);


  const config: GraphQLSubscriptionConfig<ChatContainerSubscription> = useMemo(() => ({
    subscription: subscription,
    variables: { chatId },
    onNext: (res) => {
      if (res?.addMessage) {
        console.log(res.addMessage)
      }
    },
    updater: (store) => {

      const payload = store.getRootField("addMessage")

      const chatRecord = store.get(chatId);
      if (!chatRecord) return;

      const connection = ConnectionHandler.getConnection(chatRecord, "Messages_messages")
      if (!connection) return;

      const newEdge = ConnectionHandler.createEdge(
        store,
        connection,
        payload,
        'MessageEdge'
      );

      ConnectionHandler.insertEdgeAfter(connection, newEdge);
    },
    onError: (e) => {
      console.log(e)
    },
    onCompleted: () => {
      console.log("completed")
    }
  }), [chatId]);


  useSubscription(config)


  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex flex-col items-start grow overflow-auto mt-12">
        <Message text={"henlo"} id={"asdfasdf"} key={"asdfasdf"} first />
        {conversation.map((messageObj) => (
          <Message
            text={messageObj.text}
            id={messageObj.id}
            key={messageObj.id}
            senderIsMe
            first
          />
        ))}

        {data.node ? <Messages fragmentKey={data.node} /> : null}

        {newMessages.map((msg) => (
          <Message
            text={msg.text}
            id={msg.id}
            senderIsMe={user?.id === msg.userId}
            key={msg.id}
          />)
        )}
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
            console.log("commit mutation", chatId, user.id, message)
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
  console.log(id)
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