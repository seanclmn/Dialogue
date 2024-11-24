import { Avatar } from "../users/Avatar";
import img from "../../../assets/jennie.jpeg";

export interface MessageProps extends React.DOMAttributes<HTMLElement> {
  text: string;
  id: string;
  senderIsMe?: boolean;
  first?: boolean;
}

export const Message = ({ text, senderIsMe, first }: MessageProps) => {
  if (!text) return null
  return (
    <div className={`flex w-full items-start justify-start`}>
      {first && !senderIsMe ? <Avatar src={img} /> : null}
      <div
        className={`${senderIsMe ? "bg-primary ml-auto max-w-[70%]" : "bg-secondary"
          } my-[1px] p-2 rounded-[20px] inline-flex`}
      >
        <p
          lang="en"
          className={`px-2 whitespace-break-spaces break-keep	
          text-[15px] 	 ${senderIsMe ? "text-my-txt-color" : "text-txt-color"}`}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
