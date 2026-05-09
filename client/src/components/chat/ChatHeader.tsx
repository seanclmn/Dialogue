import { ReactElement } from "react";
import { Avatar } from "../shared/users/Avatar";

interface ChatHeaderProps {
  title: string;
  style?: string;
}

export const ChatHeader = ({ title, style }: ChatHeaderProps): ReactElement => {
  return (
    <div
      className={`bg-bgd-color w-full flex justify-between items-center border-brd-color border-b-[1px] px-2 h-12 text-txt-color ${style}`}
    >
      <div className="flex items-center">
        <Avatar containerStyle="h-6 w-6 mx-1" />
        <p>{title}</p>
      </div>

    </div>
  );
};
