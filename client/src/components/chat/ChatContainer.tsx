import { Suspense, useContext, useEffect, useState } from "react";
import { getChatDisplayName, getDMAvatar } from "@utils/chatName";
import { ChatInput } from "../shared/Inputs/ChatInput";
import { Typing } from "./Typing";
import { Avatar } from "../shared/users/Avatar";
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
import { useMarkLastRead } from "@mutations/MarkLastRead";
import { useAddMessageReaction } from "@mutations/AddMessageReaction";
import { useRemoveMessageReaction } from "@mutations/RemoveMessageReaction";
import { ChatContainerSubscription } from "@generated/ChatContainerSubscription.graphql";
import { ChatContainerReactionsSubscription } from "@generated/ChatContainerReactionsSubscription.graphql";
import { GifPicker, type GifPayload } from "./GifPicker";
import { XMarkIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

const query = graphql`
  query ChatContainerQuery($id: ID!) {
    node(id: $id) {
      ... on Chat {
        id
        name
        participants {
          user {
            id
            username
            avatarUrl
          }
          lastReadMessage {
            id
          }
        }
        lastMessage {
          id
          text
        }
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
    $parentMessageId: String
  ) {
    createMessage(
      createMessageInput: {
        text: $text
        userId: $userId
        chatId: $chatId
        gifUrl: $gifUrl
        gifWidth: $gifWidth
        gifHeight: $gifHeight
        parentMessageId: $parentMessageId
      }
    ) {
      createdAt
      id
      text
      gifUrl
      gifWidth
      gifHeight
      userId
      username
      parentMessageId
      parentMessage {
        id
        text
        gifUrl
        username
      }
      reactions {
        id
        emoji
        user {
          id
          username
          avatarUrl
        }
      }
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
`;

const reactionsSubscription = graphql`
  subscription ChatContainerReactionsSubscription($chatIds: [ID!]!) {
    reactionsUpdated(chatIds: $chatIds) {
      chatId
      message {
        id
        reactions {
          id
          emoji
          user {
            id
            username
            avatarUrl
          }
        }
      }
    }
  }
`;

interface ContentProps {
  queryReference: PreloadedQuery<ChatContainerQuery>;
  chatId: string;
}

type ReplyTarget = {
  id: string;
  text: string;
  gifUrl?: string | null;
  username: string;
};

export const Content = ({ queryReference, chatId }: ContentProps) => {
  const [messageMap, setMessageMap] = useState<Record<string, string>>({});
  const [gifPayloadMap, setGifPayloadMap] = useState<Record<string, GifPayload | undefined>>({});
  const [showGifPicker, setShowGifPicker] = useState<Record<string, boolean>>({});
  const [replyToMap, setReplyToMap] = useState<Record<string, ReplyTarget | undefined>>({});
  const [isTyping, setIsTyping] = useState<boolean | null>(null);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const { user } = useContext(UserContext);
  const [commitMutation] = useMutation<ChatContainerMutation>(mutation);
  const { updateTyping } = useUpdateTyping();
  const { markLastRead } = useMarkLastRead();
  const { addMessageReaction } = useAddMessageReaction();
  const { removeMessageReaction } = useRemoveMessageReaction();
  const data = usePreloadedQuery(query, queryReference);
  const lastMessageId = data.node?.lastMessage?.id ?? null;
  console.log(data);
  const participantAvatars: Record<string, string | null> = Object.fromEntries(
    (data.node?.participants ?? []).map((p) => [p.user.id, p.user.avatarUrl ?? null])
  );

  useEffect(() => {
    if (lastMessageId && lastMessageId !== data.node?.participants?.find((p) => p.user.id === user.id)?.lastReadMessage?.id) {
      markLastRead(chatId, lastMessageId);
    }
  }, [chatId, lastMessageId]);

  useEffect(() => {
    const { id: userId } = user;
    const delayDebounceFn = setTimeout(() => {
      if (isTyping === false && userId) {
        updateTyping({ chatId, isTyping: false, userId });
      }
      setIsTyping(false);
    }, 400);

    if (isTyping && userId) {
      updateTyping({ chatId, isTyping, userId });
    }

    return () => clearTimeout(delayDebounceFn);
  }, [isTyping, chatId]);

  const config: GraphQLSubscriptionConfig<ChatContainerSubscription> = {
    subscription: subscription,
    variables: { chatId: chatId },
    updater: (store) => {
      const newEventField = store.getRootField("userTyping");
      const typingUser = newEventField.getValue("userId") as string;
      const isTyping = newEventField.getValue("isTyping");
      if (typingUser !== user.id) {
        setTypingUserId(isTyping ? typingUser : null);
      }
    },
    onError: (e) => {
      console.log(e);
    },
    onCompleted: () => {
      console.log("completed");
    },
  };

  useSubscription(config);

  const reactionsConfig: GraphQLSubscriptionConfig<ChatContainerReactionsSubscription> = {
    subscription: reactionsSubscription,
    variables: { chatIds: [chatId] },
    onError: (e) => {
      console.log(e);
    },
  };

  useSubscription(reactionsConfig);

  if (!queryReference || !data.node) {
    return null;
  }

  const replyTo = replyToMap[chatId];

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
          parentMessageId: replyTo?.id ?? undefined,
        },
      }).dispose();
      setMessageMap({ ...messageMap, [chatId]: "" });
      setGifPayloadMap({ ...gifPayloadMap, [chatId]: undefined });
      setShowGifPicker({ ...showGifPicker, [chatId]: false });
      setReplyToMap({ ...replyToMap, [chatId]: undefined });
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      {!queryReference ? <Loader /> : null}
      <ChatHeader
        title={getChatDisplayName(
          data.node?.name,
          (data.node?.participants ?? []).map((p) => p.user.username),
          user.username
        )}
        avatarUrl={getDMAvatar((data.node?.participants ?? []).map((p) => p.user), user.id)}
      />

      <div className="flex flex-col items-start grow h-1">
        {data.node ? (
          <Messages
            fragmentKey={data.node}
            participantAvatars={participantAvatars}
            onReply={(message) => setReplyToMap({ ...replyToMap, [chatId]: message })}
            onToggleReaction={(messageId, emoji, isRemoving) =>
              isRemoving
                ? removeMessageReaction(messageId, emoji)
                : addMessageReaction(messageId, emoji)
            }
          />
        ) : null}
        {typingUserId ? (
          <div className="flex flex-row items-center mb-4">
            <Avatar src={participantAvatars[typingUserId]} containerStyle="h-10 w-10 mx-2" />
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
      {replyTo ? (
        <div className="mx-2 mb-1 flex items-center gap-2 rounded-[15px] border-[1px] border-brd-color bg-bgd-color px-3 py-1">
          <ArrowUturnLeftIcon className="w-4 h-4 text-txt-color shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-txt-color">Replying to {replyTo.username}</p>
            <p className="text-xs text-txt-color opacity-70 truncate">
              {replyTo.gifUrl ? "GIF" : replyTo.text}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setReplyToMap({ ...replyToMap, [chatId]: undefined })}
            aria-label="Cancel reply"
            className="text-txt-color hover:bg-bgd-highlight rounded-full p-1 shrink-0"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
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
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
        </div>
        <button
          type="submit"
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
    if (id) loadQuery({ id: id });
  }, [id]);

  if (!id) return null;
  if (!queryReference) return (
    <div className="h-full w-full flex flex-col justify-between">
      <Loader />
    </div>);

  return (
    <Suspense fallback={<Loader />}>
      <Content queryReference={queryReference} chatId={id} />
    </Suspense>
  );
};
