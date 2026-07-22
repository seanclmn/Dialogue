import { Avatar } from "../users/Avatar";
import { useContext } from "react";
import { MessageMedia } from "./MessageMedia";
import { UserContext } from "@contexts/UserContext";
import { ArrowUturnLeftIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// Curated quick-react set, in the spirit of iMessage/Slack "tapback" shortcuts.
// Kept small and fixed rather than a full emoji picker library, since this is
// meant to be a fast, low-friction gesture rather than a search experience.
const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export interface MessageReactionData {
  id: string;
  emoji: string;
  userId: string;
  username: string;
  avatarUrl?: string | null;
}

export interface MessageProps extends React.DOMAttributes<HTMLElement> {
  styles?: string;
  startOfConversation?: boolean;
  date: string;
  text: string;
  id: string;
  gifUrl?: string | null;
  gifWidth?: number | null;
  gifHeight?: number | null;
  previousMessageUserId?: string;
  nextMessageUserId?: string;
  previousMessageDate?: string;
  nextMessageDate?: string;
  userId?: string;
  senderAvatarUrl?: string | null;
  senderUsername?: string;
  isNew?: boolean;
  parentMessageId?: string | null;
  parentMessageText?: string | null;
  parentMessageGifUrl?: string | null;
  parentMessageUsername?: string | null;
  onReply?: () => void;
  reactions?: MessageReactionData[];
  onToggleReaction?: (emoji: string, isRemoving: boolean) => void;
}

export function Message({
  isNew,
  styles,
  date,
  text,
  gifUrl,
  gifWidth,
  gifHeight,
  previousMessageUserId,
  nextMessageUserId,
  previousMessageDate,
  userId,
  senderAvatarUrl,
  senderUsername,
  parentMessageId,
  parentMessageText,
  parentMessageGifUrl,
  parentMessageUsername,
  onReply,
  reactions,
  onToggleReaction,
}: MessageProps) {
  const { user } = useContext(UserContext);

  const startOfConversation = previousMessageDate
    ? new Date(date).getTime() - new Date(previousMessageDate).getTime() > 3600000
    : false;

  const first = previousMessageUserId !== userId;
  const last = nextMessageUserId !== userId && previousMessageUserId === userId;
  const isolatedMessage = previousMessageUserId !== userId && nextMessageUserId !== userId || startOfConversation;
  const senderIsMe = userId === user?.id;

  const rowStyles = senderIsMe
    ? `w-full flex items-end justify-end pr-2 ${styles ?? ""}`
    : `w-full flex items-start justify-start ${!last && !isolatedMessage ? "pl-14" : ""} ${styles ?? ""}`;

  const base = "my-[1px] p-1 py-2 rounded-[18px] inline-flex flex-col gap-1";
  const color = senderIsMe ? "bg-primary" : "bg-secondary";
  const bubbleStyles = isolatedMessage
    ? `${color} ${base} mb-4`
    : last
      ? `${color} ${base} ${senderIsMe ? "rounded-tr-none" : "rounded-tl-none"} mb-4`
      : first
        ? `${color} ${base} ${senderIsMe ? "rounded-br-none" : "rounded-bl-none"}`
        : `${color} ${base} ${senderIsMe ? "rounded-r-none" : "rounded-l-none"}`;

  const textColor = senderIsMe ? "text-my-txt-color" : "text-txt-color";

  const isReply = !!parentMessageId;
  const replyPreviewRowStyles = senderIsMe
    ? "w-full flex justify-end pr-2"
    : `w-full flex justify-start ${!last && !isolatedMessage ? "pl-14" : ""}`;

  const replyButton = onReply ? (
    <button
      type="button"
      onClick={onReply}
      aria-label="Reply"
      title="Reply"
      className={`shrink-0 self-center p-1 rounded-full opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-txt-color hover:bg-bgd-highlight ${senderIsMe ? "mr-1" : "ml-1"}`}
    >
      <ArrowUturnLeftIcon className="w-4 h-4" />
    </button>
  ) : null;

  const myReactedEmojis = new Set(
    (reactions ?? []).filter((r) => r.userId === user?.id).map((r) => r.emoji)
  );

  const groupedReactions = (() => {
    const order: string[] = [];
    const reactorsByEmoji = new Map<string, MessageReactionData[]>();
    for (const r of reactions ?? []) {
      const reactors = reactorsByEmoji.get(r.emoji);
      if (reactors) {
        reactors.push(r);
      } else {
        reactorsByEmoji.set(r.emoji, [r]);
        order.push(r.emoji);
      }
    }
    return order.map((emoji) => {
      const reactors = reactorsByEmoji.get(emoji) ?? [];
      return {
        emoji,
        reactors,
        reactedByMe: myReactedEmojis.has(emoji),
      };
    });
  })();

  const reactButton = onToggleReaction ? (
    <Menu as="div" className="relative self-center">
      <MenuButton
        aria-label="React"
        title="React"
        className={`shrink-0 p-1 rounded-full opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-txt-color hover:bg-bgd-highlight ${senderIsMe ? "mr-1" : "ml-1"}`}
      >
        <FaceSmileIcon className="w-4 h-4" />
      </MenuButton>
      <MenuItems
        anchor="top"
        className="z-10 flex gap-1 rounded-full bg-bgd-highlight border border-brd-color px-2 py-1 shadow-lg"
      >
        {QUICK_REACTIONS.map((emoji) => (
          <MenuItem key={emoji}>
            <button
              type="button"
              onClick={() => onToggleReaction(emoji, myReactedEmojis.has(emoji))}
              className={`text-lg rounded-full p-1 hover:bg-bgd-color transition-colors ${myReactedEmojis.has(emoji) ? "bg-bgd-color" : ""}`}
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  ) : null;

  // All reactions on the message collapse into a single badge (rather than
  // one pill per distinct emoji): the badge shows up to the first 3 distinct
  // emoji, and the full per-reactor breakdown (including any emoji beyond
  // the first 3) is only ever surfaced in the hover tooltip.
  const totalReactionsCount = reactions?.length ?? 0;
  const visibleReactionEmojis = groupedReactions.slice(0, 3).map((g) => g.emoji);
  const iHaveReacted = myReactedEmojis.size > 0;
  const removeMyReactions = iHaveReacted
    ? () => {
        for (const emoji of myReactedEmojis) {
          onToggleReaction?.(emoji, true);
        }
      }
    : undefined;

  // Anchored to the bottom-left corner of the bubble, overlapping it slightly
  // (like a tapback badge) rather than flowing below it.
  const reactionPills = groupedReactions.length > 0 ? (
    <div className="absolute bottom-[0.5px] z-20 cursor-pointer">
      <div className="relative group/reaction">
        <button
          type="button"
          onClick={removeMyReactions}
          aria-label={groupedReactions
            .map((g) => `${g.emoji} from ${g.reactors.map((r) => r.username).join(", ")}`)
            .join("; ")}
          className={"flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border shadow-sm transition-colors bg-secondary border-bgd-color text-my-txt-color"}
        >
          {visibleReactionEmojis.map((emoji, index) => (
            <span key={`${emoji}-${index}`}>{emoji}</span>
          ))}
          {totalReactionsCount > 1 ? <span>{totalReactionsCount}</span> : null}
        </button>

        <div
          className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden w-max -translate-x-1/2 flex-col gap-1 rounded-lg border border-brd-color bg-bgd-highlight p-2 shadow-lg group-hover/reaction:flex group-focus-within/reaction:flex"
          role="tooltip"
        >
          {(reactions ?? []).map((reactor) => (
            <div key={reactor.id} className="flex items-center gap-2">
              <Avatar src={reactor.avatarUrl} containerStyle="h-5 w-5" />
              <span className="text-xs text-txt-color whitespace-nowrap">{reactor.username}</span>
              <span className="text-xs">{reactor.emoji}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className={`${isNew ? "message-in" : ""}${styles ?? ""}`}>
      {startOfConversation ? (
        <p className="text-center text-gray-500 mb-4 mt-16">{date}</p>
      ) : null}
      {isReply ? (
        <>
        <div className={replyPreviewRowStyles }>
          <div className={`pl-2 flex flex-col my-2 ${senderIsMe ? "items-end" : "items-start ml-12"}`}>
            <p className={`text-xs truncate my-1 `}>{senderIsMe ? `You replied to ${parentMessageUsername}` : `${senderUsername} replied to ${parentMessageUsername === user.username ? "you" : parentMessageUsername}`}</p>
            <div className={`flex flex-row justify-between ${senderIsMe ? "flex-row-reverse" : "flex-row"}`}>
              <div className="border-l-2"/>
              <div className="mx-2 max-w-md min-w-0 my-1 px-3 py-1 rounded-2xl bg-secondary opacity-50">
                <p className="truncate text-[15px]">
                  {parentMessageGifUrl ? "GIF" : parentMessageText || "Message"}
                </p>
              </div>
            </div>
          </div>
        </div>
        </>
      ) : null}
      <div className={`${rowStyles} ${styles} group`}>
        {(last || isolatedMessage) && !senderIsMe ? (
          <Avatar src={senderAvatarUrl} containerStyle="h-10 w-10 mx-2" username={senderUsername} />
        ) : null}

        {senderIsMe ? (
          <>
            {reactButton}
            {replyButton}
          </>
        ) : null}

        {gifUrl ? (
          <div className={`relative ${groupedReactions.length > 0 ? "mb-3" : ""}`}>
            <MessageMedia
              type="gif"
              url={gifUrl}
              width={gifWidth ?? undefined}
              height={gifHeight ?? undefined}
              styles={senderIsMe ? "ml-auto" : ""}
            />
            {reactionPills}
          </div>
        ) : text && text.length > 0 ? (
            <div className={`relative ${groupedReactions.length > 0 ? "mb-3" : ""}`}>
              <div className={`${bubbleStyles} max-w-md`}>
                <p lang="en" className={`px-2 whitespace-break-spaces break-keep text-[15px] ${textColor}`}>
                  {text} 
                </p>
              </div>
              {reactionPills}
            </div>
        ) : null}

        {!senderIsMe ? (
          <>
            {replyButton}
            {reactButton}
          </>
        ) : null}
      </div>
    </div>
  );
}