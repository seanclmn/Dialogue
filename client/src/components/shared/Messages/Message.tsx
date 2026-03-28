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
  gifWidth?: number | null;
  gifHeight?: number | null;
  previousMessageUserId?: string;
  nextMessageUserId?: string;
  previousMessageDate?: string;
  nextMessageDate?: string;
  userId?: string;
}

export const Message = memo(({ props }: { props: MessageProps }) => {
  const { user } = useContext(UserContext);
  const {
    styles,
    date,
    text,
    gifUrl,
    gifWidth,
    gifHeight,
    previousMessageUserId,
    nextMessageUserId,
    previousMessageDate,
    nextMessageDate,
    userId,
  } = props;

  const startOfConversation = useMemo(() => {
    if (previousMessageDate) {
      return new Date(date).getTime() - new Date(previousMessageDate).getTime() > 3600000;
    }
    return false;
  }, [date, previousMessageDate]);

  // const endOfConversation = useMemo(() => {
  //   if (nextMessageDate) {
  //     return new Date(date).getTime() - new Date(nextMessageDate).getTime() > 3600000;
  //   }
  //   return false;
  // }, [date, nextMessageDate]);


  const first = previousMessageUserId !== userId;
  const last = nextMessageUserId !== userId && previousMessageUserId === userId;
  const isolatedMessage = previousMessageUserId !== userId && nextMessageUserId !== userId || startOfConversation;
  const senderIsMe = userId === user?.id;


  const rowStyles = useMemo(() => {
    if (senderIsMe) {
      return `w-full flex items-end justify-end pr-2 ${styles ?? ""}`;
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
    <div className={styles}>
      {startOfConversation ? (
        <p className="text-center text-gray-500 mb-4 mt-16">{date}</p>
      ) : null}
      <div className={`${rowStyles} ${styles} `}>
        {(last || isolatedMessage) && !senderIsMe ? (
          <Avatar src={img} containerStyle="h-10 w-10 mx-2" />
        ) : null}

        {gifUrl ? (
          <MessageMedia
            type="gif"
            url={gifUrl}
            width={gifWidth ?? undefined}
            height={gifHeight ?? undefined}
            styles={senderIsMe ? "ml-auto" : ""}
          />
        ) : text && text.length > 0 ? (
            <div className={`${bubbleStyles} max-w-md`}>
              <p lang="en" className={`px-2 whitespace-break-spaces break-keep text-[15px] ${textColor}`}>
                {text} 
              </p>
            </div>
        ) : null}
      </div>
    </div>
  );
});
