import { Avatar } from "../users/Avatar";
import img from "../../../assets/jennie.jpeg";

export interface MessageProps extends React.DOMAttributes<HTMLElement> {
  text: string;
  id: string;
  senderIsMe?: boolean;
  first?: boolean;
}

export const Message = ({ text, senderIsMe, first }: MessageProps) => {
  return (
    <div className={`flex w-full items-start justify-start`}>
      {first && !senderIsMe ? <Avatar src={img} /> : null}
      <div
        className={`${senderIsMe ? "bg-blue-500 ml-auto max-w-[70%]" : "bg-gray-200"
          } my-[1px] p-1 rounded-[20px] inline-flex`}
      >
        <p
          lang="en"
          className={`px-2 whitespace-break-spaces break-keep	
          text-[15px] 	 ${senderIsMe ? "text-white" : ""}`}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
