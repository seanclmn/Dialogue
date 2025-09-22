import { Avatar } from "../users/Avatar";
import img from "../../../assets/jennie.jpeg";
import { memo, useState } from "react";

export interface MessageProps extends React.DOMAttributes<HTMLElement> {
  date: string;
  text: string;
  id: string;
  senderIsMe?: boolean;
  first?: boolean;
}

export const Message = memo(({ date, text, senderIsMe, first }: MessageProps) => {
  const [, setVisible] = useState(false);
  return (
    <div className={`flex w-full items-start`}
    >
      {first && !senderIsMe ? <Avatar src={img} /> : null}
      <div
        className={`${senderIsMe ? "bg-primary ml-auto" : "bg-secondary"
          } my-[1px] p-1 py-2 rounded-[18px] inline-flex`}
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
      </div>
    </div>
  );
});