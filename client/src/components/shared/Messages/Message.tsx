import { Avatar } from "../users/Avatar";
import img from "../../../assets/jennie.jpeg";
import { memo, useState } from "react";

export interface MessageProps extends React.DOMAttributes<HTMLElement> {
  date: string;
  text: string;
  id: string;
  senderIsMe?: boolean;
  first?: boolean;
  last?: boolean;
  startOfConversation?: boolean;
}

export const Message = memo(({ date, text, senderIsMe, first, last, startOfConversation }: MessageProps) => {
  const [, setVisible] = useState(false);
  return (
    <div className="w-full" >
      {startOfConversation ? <p className="text-center text-gray-500 mb-4 mt-16">{date}</p> : null}

      <div className={`flex w-full items-start`}>
        {last && !senderIsMe ? <Avatar src={img} containerStyle="h-10 w-10 mx-2" /> : null}
        <div
          className={`${senderIsMe ? "bg-primary ml-auto" : "bg-secondary"
            } ${!last && !senderIsMe ? "ml-14" : ""} my-[1px] p-1 py-2 rounded-[18px] inline-flex`}
        >
          <p
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            lang="en"
            className={`px-2 whitespace-break-spaces break-keep	
            text-[15px] ${senderIsMe ? "text-my-txt-color" : "text-txt-color"}`}
          >
            {text ? text : "No text provided"}
          </p>
          {/* add date, only visible on hover */}
        </div>
        
      </div>
    </div>
  );
});