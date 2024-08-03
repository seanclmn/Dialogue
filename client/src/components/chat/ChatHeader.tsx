import { ReactElement } from "react";
import { Avatar } from "../shared/users/Avatar";
import img from "../../assets/jennie.jpeg";

interface ChatHeaderProps {
  title: string;
  style?: string;
}

export const ChatHeader = ({ title, style }: ChatHeaderProps): ReactElement => {
  return (
    <>
      <div
        className={`bg-white w-full flex items-center border-b-[1px] py-1 px-2 ${style} `}
      >
        <Avatar src={img} />
        <p>{title}</p>
      </div>
    </>
  );
};
