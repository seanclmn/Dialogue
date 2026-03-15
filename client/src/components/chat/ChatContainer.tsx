import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import { ChatInput } from "../shared/Inputs/ChatInput";
import { Typing } from "./Typing";
import { Avatar } from "../shared/users/Avatar";
import img from "../../assets/jennie.jpeg";
import { Loader } from "../shared/loaders/Loader";
import { graphql, GraphQLSubscriptionConfig } from "relay-runtime";
import {
  PreloadedQuery,
  useMutation,
  usePreloadedQuery,
  useQueryLoader,
  useSubscription,
} from "react-relay";
import { ChatContainerQuery } from "@generated/ChatContainerQuery.graphql";
import { ChatContainerMutation } from "@generated/ChatContainerMutation.graphql";
import { UserContext } from "../../contexts/UserContext";
import { Messages } from "./Messages";
import { useParams } from "react-router";
import { ChatHeader } from "./ChatHeader";
import { ChatSendButton } from "@components/shared/Buttons/ChatSendButton";
import { useUpdateTyping } from "@mutations/UpdateTyping";
import { ChatContainerSubscription } from "@generated/ChatContainerSubscription.graphql";
import { GifPicker, type GifPayload } from "./GifPicker";

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
    $gifUrl: String
    $gifWidth: Int
    $gifHeight: Int
  ) {
    createMessage(
      createMessageInput: { text: $text, userId: $userId, chatId: $chatId, gifUrl: $gifUrl, gifWidth: $gifWidth, gifHeight: $gifHeight }
    ) {
      createdAt
      id
      text
      gifUrl
      gifWidth
      gifHeight
      userId
    }
  }
`;

const subscription = graphql`
  subscription ChatContainerSubscription($chatId: ID!) {
    userTyping(chatId: $chatId) {
      chatId
      isTyping
      userId
    } 
  }
`

interface ContentProps {
  queryReference: PreloadedQuery<ChatContainerQuery>;
  chatId: string;
}

export const Content = ({ queryReference, chatId }: ContentProps) => {
  const [messageMap, setMessageMap] = useState<Record<string, string>>({});
  const [gifPayloadMap, setGifPayloadMap] = useState<Record<string, GifPayload | undefined>>({});
  const [showGifPicker, setShowGifPicker] = useState<Record<string, boolean>>({});
  const [isTyping, setIsTyping] = useState<boolean | null>(null);
  const { user } = useContext(UserContext);
  const [commitMutation] = useMutation<ChatContainerMutation>(mutation);
  const { updateTyping } = useUpdateTyping();
  const data = usePreloadedQuery(query, queryReference);
  const [friendTyping, setFriendTyping] = useState<boolean>(false);

  useEffect(() => {
    console.log(isTyping)
    const { id: userId } = user;
    const delayDebounceFn = setTimeout(() => {
      if (isTyping === false && userId) {
        updateTyping({ chatId, isTyping: false, userId });
      }
      setIsTyping(false);
    }, 400);

    if (isTyping && userId) {
      console.log(isTyping)
      updateTyping({ chatId, isTyping, userId });
    }

    return () => clearTimeout(delayDebounceFn);
  }, [isTyping, chatId]);

  if (!queryReference || !data.node) {
    return null;
  }
  const config: GraphQLSubscriptionConfig<ChatContainerSubscription> = useMemo(
    () => ({
      subscription: subscription,
      variables: { chatId: chatId },
      updater: (store) => {
        const newEventField = store.getRootField("userTyping");
        const typingUser = newEventField.getValue("userId");
        const isTyping = newEventField.getValue("isTyping");
        if (typingUser !== user.id) setFriendTyping(() => isTyping);
      },
      onError: (e) => {
        console.log(e);
      },
      onCompleted: () => {
        console.log("completed");
      },
    }),
    [data.node?.id],
  );

  useSubscription(config);

  const handleSendMessage = () => {
    const text = messageMap[chatId]?.trim() ?? "";
    const gif = gifPayloadMap[chatId];
    const gifUrl = gif?.url?.trim() || null;
    const hasContent = text.length > 0 || gifUrl;
    if (user?.id && hasContent) {
      commitMutation({
        variables: {
          text: text || " ",
          userId: user.id,
          chatId: chatId,
          gifUrl: gifUrl ?? undefined,
          gifWidth: gif?.width ?? undefined,
          gifHeight: gif?.height ?? undefined,
        },
      }).dispose();
      setMessageMap({ ...messageMap, [chatId]: "" });
      setGifPayloadMap({ ...gifPayloadMap, [chatId]: undefined });
      setShowGifPicker({ ...showGifPicker, [chatId]: false });
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      {!queryReference ? <Loader /> : null}
      <ChatHeader title={data.node?.name ?? "(unnamed chat)"} />

      <div className="flex flex-col items-start grow h-1">
        {data.node ? <Messages fragmentKey={data.node} /> : null}
        {friendTyping ? (
          <div className="flex flex-row">
            <Avatar src={img} containerStyle="h-8" />
            <Typing />
          </div>
        ) : null}
      </div>
      {showGifPicker[chatId] ? (
        <div className="mx-2 mb-2 flex justify-start">
          <GifPicker
            onSelect={(payload) => {
              setGifPayloadMap({ ...gifPayloadMap, [chatId]: payload });
            }}
            onClose={() => setShowGifPicker({ ...showGifPicker, [chatId]: false })}
          />
        </div>
      ) : null}
      {gifPayloadMap[chatId]?.url ? (
        <div className="mx-2 mb-1 flex items-center gap-2">
          <span className="text-txt-color text-sm">Selected GIF:</span>
          <img
            src={gifPayloadMap[chatId].url}
            alt=""
            className="h-12 w-auto rounded object-cover border border-brd-color"
          />
          <button
            type="button"
            onClick={() => setGifPayloadMap({ ...gifPayloadMap, [chatId]: undefined })}
            className="text-sm text-txt-color hover:underline"
          >
            Remove
          </button>
        </div>
      ) : null}
      <form
        className="mx-2 mb-2 border-[1px] rounded-[15px] px-[1rem] py-[4px] border-brd-color flex flex-wrap items-center gap-1 bg-bgd-color"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <div className="flex-1 min-w-[120px]">
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
                handleSendMessage();
              }
            }}
          />
        </div>
        <button
          type="button"
          title="Search GIFs"
          className="px-2 py-1 rounded text-txt-color hover:bg-bgd-highlight shrink-0"
          onClick={() => setShowGifPicker({ ...showGifPicker, [chatId]: !showGifPicker[chatId] })}
          aria-label="Search GIFs"
        >
          GIF
        </button>
        <ChatSendButton
          disabled={
            !((messageMap[chatId]?.trim().length ?? 0) > 0 || (gifPayloadMap[chatId]?.url?.trim().length ?? 0) > 0)
          }
          onClick={handleSendMessage}
        />
      </form>
    </div>
  );
};

export const ChatContainer = () => {
  const { id } = useParams();
  const [queryReference, loadQuery] = useQueryLoader<ChatContainerQuery>(query);

  useEffect(() => {
    console.log("wonton")
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
