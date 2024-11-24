import { ReactElement } from "react";
import { Avatar } from "../shared/users/Avatar";
import img from "../../assets/jennie.jpeg";
import UserMenu from "@components/dialogs/UserMenu";

interface ChatHeaderProps {
  title: string;
  style?: string;
}

export const ChatHeader = ({ title, style }: ChatHeaderProps): ReactElement => {
  return (
    <div
      className={`bg-white w-full flex justify-between items-center border-brd-color border-b-[1px] px-2 h-12 ${style}`}
    >
      <div className="flex items-center">
        <Avatar src={img} containerStyle="h-6" />
        <p>{title}</p>
      </div>

      <UserMenu />
    </div>
  );
};
