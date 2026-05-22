import { Avatar } from "../shared/users/Avatar";
import { Link, useParams } from "react-router";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

interface ChatGroupProps {
  name: string;
  chatId: string;
  avatarUrl?: string | null;
  hasUnread?: boolean;
  lastMessage?: {
    text: string;
    userId: string;
    username: string;
    gifUrl?: string;
  } | null;
}

export const ChatGroup = ({ name, chatId, avatarUrl, lastMessage, hasUnread }: ChatGroupProps) => {
  const { id } = useParams();
  return (
    <Link to={`/chats/${chatId}`}>
      <div
        className={`
        flex flex-row items-center justify-center md:justify-start
        p-2 h-18 hover:bg-bgd-highlight
        ${id === chatId ? "bg-bgd-highlight" : ""}`}
      >
        <div className="relative shrink-0">
          <Avatar src={avatarUrl} containerStyle="h-10 w-10 md:h-14 md:w-14" username={name} />
          {hasUnread && (
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-error border-2 border-bgd-color" />
          )}
        </div>
        <div className="hidden md:flex mx-2 h-full flex-col justify-between min-w-0 flex-1">
          <p className={`text-sm mb-1 text-txt-color truncate ${hasUnread ? "font-extrabold" : "font-bold"}`}>{name}</p>
          {lastMessage ? (
            <LastMessage lastMessage={lastMessage} hasUnread={hasUnread} />
          ) : (
            <p className="text-xs">Say hi!</p>
          )}
        </div>
      </div>
    </Link>
  );
};

const LastMessage = ({ lastMessage, hasUnread }: { lastMessage: { text: string; userId: string; username: string; gifUrl?: string }; hasUnread?: boolean }) => {
  const userContext = useContext(UserContext);
  const weight = hasUnread ? "font-semibold text-txt-color" : "text-txt-muted";

  if (lastMessage.gifUrl) {
    return (
      <p className={`text-xs ${weight}`}>
        {userContext.user.id === lastMessage.userId ? "You sent a gif" : `${lastMessage.username} sent a gif`}
      </p>
    );
  }

  const prefix = userContext.user.id === lastMessage.userId ? "You" : lastMessage.username;
  const body = lastMessage.text.length > 20 ? lastMessage.text.slice(0, 20) + "…" : lastMessage.text;

  return (
    <p className={`text-xs ${weight}`}>
      <span className={` ${hasUnread ? "font-bold" : "font-semibold"}`}>{prefix}: </span>{body}
    </p>
  );
};
