import { Avatar } from "../users/Avatar";
import img from "../../../assets/jennie.jpeg";
import { memo, useContext, useMemo } from "react";
import { MessageMedia } from "./MessageMedia";
import { UserContext } from "@contexts/UserContext";

export interface MessageProps extends React.DOMAttributes<HTMLElement> {
  styles?: string;
  startOfConversation?: boolean;
  date: string;
  text: string;
  id: string;
  gifUrl?: string | null;
  previousMessageUserId?: string;
  nextMessageUserId?: string;
  previousMessageDate?: string;
  userId?: string;
}

export const Message = memo(({ props }: { props: MessageProps }) => {
  const { user } = useContext(UserContext);
  const {
    styles,
    date,
    text,
    gifUrl,
    previousMessageUserId,
    nextMessageUserId,
    previousMessageDate,
    userId,
  } = props;

  const first = previousMessageUserId !== userId;
  const last = nextMessageUserId !== userId && previousMessageUserId === userId;
  const isolatedMessage = previousMessageUserId !== userId && nextMessageUserId !== userId;
  const senderIsMe = userId === user?.id;

  const startOfConversation = useMemo(() => {
    if (previousMessageDate) {
      return new Date(date).getTime() - new Date(previousMessageDate).getTime() > 3600000;
    }
    return false;
  }, [date, previousMessageDate]);

  const rowStyles = useMemo(() => {
    if (senderIsMe) {
      return `w-full flex items-start justify-end ${styles ?? ""}`;
    }
    return `w-full flex items-start justify-start ${!last && !isolatedMessage ? "pl-14" : ""} ${styles ?? ""}`;
  }, [userId, styles, last, isolatedMessage, senderIsMe]);

  const bubbleStyles = useMemo(() => {
    const base = "my-[1px] p-1 py-2 rounded-[18px] inline-flex flex-col gap-1";
    const color = senderIsMe ? "bg-primary" : "bg-secondary";
    if (isolatedMessage) return `${color} ${base}`;
    if (last) return `${color} ${base} ${senderIsMe ? "rounded-tr-none" : "rounded-tl-none"}`;
    if (first) return `${color} ${base} ${senderIsMe ? "rounded-br-none" : "rounded-bl-none"}`;
    return `${color} ${base} ${senderIsMe ? "rounded-r-none" : "rounded-l-none"}`;
  }, [first, last, isolatedMessage, senderIsMe]);

  const textColor = senderIsMe ? "text-my-txt-color" : "text-txt-color";

  return (
    <div className={rowStyles}>
      {startOfConversation ? (
        <p className="text-center text-gray-500 mb-4 mt-16">{date}</p>
      ) : null}
      {(last || isolatedMessage) && !senderIsMe ? (
        <Avatar src={img} containerStyle="h-10 w-10 mx-2" />
      ) : null}

      {gifUrl ? (
        <MessageMedia type="gif" url={gifUrl} styles={senderIsMe ? "ml-auto" : ""} />
      ) : text && text.length > 0 ? (
        <div className="flex w-full items-start">
          <div className={bubbleStyles}>
            <p lang="en" className={`px-2 whitespace-break-spaces break-keep text-[15px] ${textColor}`}>
              {text}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
});
