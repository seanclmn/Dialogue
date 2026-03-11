import { Avatar } from "../users/Avatar";
import img from "../../../assets/jennie.jpeg";
import { memo, useState } from "react";
import { MessageMedia } from "./MessageMedia";

export interface MessageProps extends React.DOMAttributes<HTMLElement> {
  date: string;
  text: string;
  id: string;
  gifUrl?: string | null;
  senderIsMe?: boolean;
  first?: boolean;
  last?: boolean;
  startOfConversation?: boolean;
}

export const Message = memo(({ date, text, gifUrl, senderIsMe, last, startOfConversation }: MessageProps) => {

  if(gifUrl) {
    return (
      <div className="w-full" >
        {startOfConversation ? <p className="text-center text-gray-500 mb-4 mt-16">{date}</p> : null}
        <div className={`flex w-full items-end`}>
          <MessageMedia type="gif" url={gifUrl} styles={`${senderIsMe ? "ml-auto" : ""}`} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" >
      {startOfConversation ? <p className="text-center text-gray-500 mb-4 mt-16">{date}</p> : null}
      {text && text.length > 0 ? 
        <MessageTextContent text={text} senderIsMe={senderIsMe} last={last} />
      : null}
    </div>
  );
});

const MessageTextContent = ({ text, senderIsMe, last }: { text: string, senderIsMe?: boolean, last?: boolean }) => {
  return (
    <div className={`flex w-full items-start`}>
      {last && !senderIsMe ? <Avatar src={img} containerStyle="h-10 w-10 mx-2" /> : null}
      <div
        className={`${senderIsMe ? "bg-primary ml-auto mr-2" : "bg-secondary"
          } ${!last && !senderIsMe ? "ml-14" : ""}  my-[1px] p-1 py-2 rounded-[18px] inline-flex flex-col gap-1`}
      >
        <p
          lang="en"
          className={`px-2 whitespace-break-spaces break-keep	
          text-[15px] ${senderIsMe ? "text-my-txt-color" : "text-txt-color"}`}
        >
          {text}
        </p>
      </div>
    </div> 
  );
};



