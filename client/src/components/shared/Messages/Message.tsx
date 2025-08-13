import { Avatar } from "../users/Avatar";
import img from "../../../assets/jennie.jpeg";

export interface MessageProps extends React.DOMAttributes<HTMLElement> {
  date: string;
  text: string;
  id: string;
  senderIsMe?: boolean;
  first?: boolean;
}

export const Message = ({ date, text, senderIsMe, first }: MessageProps) => {
  // if (!text) return null;
  const formattedDate = new Date(date).toDateString()
  return (
    <div className={`flex w-full items-start`}>
      {first && !senderIsMe ? <Avatar src={img} /> : null}
      <div
        className={`${senderIsMe ? "bg-primary ml-auto" : "bg-secondary"
          } my-[1px] p-1 rounded-[10px] inline-flex`}
      >
        <p
          lang="en"
          className={`px-2 whitespace-break-spaces break-keep	
          text-[15px] ${senderIsMe ? "text-my-txt-color" : "text-txt-color"}`}
        >
          {text ? text : "No text provided"}
        </p>
      </div>
      {<p>{formattedDate}</p>}
    </div>
  );
};
