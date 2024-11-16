import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Message, MessageProps } from "../shared/Messages/Message";
import { ChatInput } from "../shared/Inputs/ChatInput";
import { ChatSendButton } from "../shared/Buttons/ChatSendButton";
import { Typing } from "./Typing";
import { Avatar } from "../shared/users/Avatar";
import img from "../../assets/jennie.jpeg";
import { Loader } from "../shared/loaders/Loader";
import { Disposable, graphql, GraphQLSubscriptionConfig, IEnvironment, requestSubscription } from "relay-runtime";
import { PreloadedQuery, useMutation, usePreloadedQuery, useQueryLoader, useSubscription } from "react-relay";
import { ChatContainerQuery } from "@generated/ChatContainerQuery.graphql";
import { ChatContainerMutation } from "@generated/ChatContainerMutation.graphql";
import { UserContext } from "../../UserContext";
import { ChatContainerSubscription, ChatContainerSubscription$data } from "@generated/ChatContainerSubscription.graphql";

const query = graphql`
  query ChatContainerQuery($id:ID!) {
    chat(id: $id){
      id
      name      
      participants {
        username
        id
      }
      messages(first: 1000, after: "2024-11-01T12:34:56.789Z") {
        edges {
          cursor
          node {
            id
            text
            createdAt
            userId
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
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
  // const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<MessageProps[]>([]);
  const { user } = useContext(UserContext)
  const [commitMutation, isMutationInFlight] = useMutation<ChatContainerMutation>(mutation)

  const data = usePreloadedQuery(query, queryReference).chat
  const [newMessages, setNewMessages] = useState<ChatContainerSubscription$data["addMessage"][]>([])
  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     setIsTyping(false);
  //   }, 2000);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [isTyping]);


  const config: GraphQLSubscriptionConfig<ChatContainerSubscription> = useMemo(() => ({
    subscription: subscription,
    variables: { chatId },
    onNext: (res) => {
      console.log(res)
      if (res?.addMessage) {
        console.log(newMessages)
        setNewMessages([...newMessages, res?.addMessage])
      }
    },
    onError: (e) => {
      console.log(e)
    },
    onCompleted: () => {
      console.log("completed")
    }
  }), [chatId]);


  // useEffect(()=> {
  //   const subscription = subscribeToMessages(chatId);
  //   return () => {
  //     subscription.dispose(); // Clean up the subscription
  //   };
  // },[chatId])


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
        {data.messages.edges.map((edge) => (
          <Message
            text={edge.node.text}
            id={edge.node.id}
            senderIsMe={user?.id === edge.node.userId}
            key={edge.node.id}
          />)
        )}
        {newMessages.map((msg) => (
          <Message
            text={msg.text}
            id={msg.id}
            senderIsMe={user?.id === msg.userId}
            key={msg.id}
          />)
        )}
        {/* {isTyping ? (
          <div className="flex flex-row">
            <Avatar src={img} />
            <Typing />
          </div>
        ) : null} */}
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
            // setIsTyping(false);
          }
        }}
      >
        <ChatInput
          value={message}
          onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
            // setIsTyping(true);
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
          }
        }} />
      </form>
    </div>
  );
};

interface ChatContainerProps {
  id: string;
}

export const ChatContainer = ({ id }: ChatContainerProps) => {
  const [queryReference, loadQuery] = useQueryLoader<ChatContainerQuery>(query);

  useEffect(() => {
    loadQuery({ id: id })
  }, [])

  if (!queryReference) return <Loader />

  return (
    <Suspense>
      <Content queryReference={queryReference} chatId={id} />
    </Suspense>
  )
}