import { Suspense, useContext, useEffect, useState } from "react";
import { ChatInput } from "../shared/Inputs/ChatInput";
import { Typing } from "./Typing";
import { Avatar } from "../shared/users/Avatar";
import img from "../../assets/jennie.jpeg";
import { Loader } from "../shared/loaders/Loader";
import { graphql } from "relay-runtime";
import {
  PreloadedQuery,
  useMutation,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { ChatContainerQuery } from "@generated/ChatContainerQuery.graphql";
import { ChatContainerMutation } from "@generated/ChatContainerMutation.graphql";
import { UserContext } from "../../contexts/UserContext";
import { Messages } from "./Messages";
import { useParams } from "react-router";
import { ChatHeader } from "./ChatHeader";
import { ChatSendButton } from "@components/shared/Buttons/ChatSendButton";

const query = graphql`
  query ChatContainerQuery($id: ID!) {
    node(id: $id) {
      ... on Chat {
        id
        name
        ...Messages_chat
      }
    }
  }
`;

const mutation = graphql`
  mutation ChatContainerMutation(
    $text: String!
    $userId: String!
    $chatId: String!
  ) {
    createMessage(
      createMessageInput: { text: $text, userId: $userId, chatId: $chatId }
    ) {
      createdAt
      id
      text
      userId
    }
  }
`;

interface ContentProps {
  queryReference: PreloadedQuery<ChatContainerQuery>;
  chatId: string;
}

export const Content = ({ queryReference, chatId }: ContentProps) => {
  const [messageMap, setMessageMap] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useContext(UserContext);
  const [commitMutation] = useMutation<ChatContainerMutation>(mutation);
  const data = usePreloadedQuery(query, queryReference);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setIsTyping(false);
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [isTyping, chatId]);

  if (!queryReference || !data.node) {
    return <p>wonton</p>
  }

  return (
    <div className="h-full w-full flex flex-col justify-between">
      {!queryReference ? <Loader /> : null}
      <ChatHeader title={data.node?.name ?? "(unnamed chat)"} />

      <div className="flex flex-col items-start grow px-2 py-4 h-1">
        {data.node ? <Messages fragmentKey={data.node} /> : null}
        {isTyping ? (
          <div className="flex flex-row">
            <Avatar src={img} containerStyle="h-8" />
            <Typing />
          </div>
        ) : null}
      </div>
      <form
        className="mx-2 mb-2 border-[1px] rounded-[15px] 
         px-[1rem] py-[4px]
        border-black flex items-center 
        "
        onSubmit={(e: React.KeyboardEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (user?.id) {
            commitMutation({
              variables: {
                text: message,
                userId: user.id,
                chatId: chatId,
              },
            }).dispose();
            setMessage("");
          }
        }}
      >
        <ChatInput
          value={messageMap[chatId] ?? ""}
          onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
            setIsTyping(true);
            e.preventDefault();
            const obj = { ...messageMap };
            obj[chatId] = e.currentTarget.value;
            setMessageMap(obj);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (user?.id) {
                commitMutation({
                  variables: {
                    text: messageMap[chatId],
                    userId: user.id,
                    chatId: chatId,
                  },
                }).dispose();
                setMessageMap({ ...messageMap, [chatId]: "" });
              }
            }
          }}
        />
        <ChatSendButton
          disabled={messageMap[chatId]?.length === 0}
          onClick={() => {
            if (user?.id) {
              commitMutation({
                variables: {
                  text: messageMap[chatId],
                  userId: user.id,
                  chatId: chatId,
                },
              }).dispose();
              setMessageMap({ ...messageMap, [chatId]: "" });
            }
          }}
        />
      </form>
    </div>
  );
};

export const ChatContainer = () => {
  const { id } = useParams();
  const [queryReference, loadQuery] = useQueryLoader<ChatContainerQuery>(query);

  useEffect(() => {
    if (id) loadQuery({ id: id });
  }, [id]);

  if (!id) return null;
  if (!queryReference) return (
    <div className="h-full w-full flex flex-col justify-between">
      <Loader />
    </div>);

  return (
    <Suspense>
      <Content queryReference={queryReference} chatId={id} />
    </Suspense>
  );
};
