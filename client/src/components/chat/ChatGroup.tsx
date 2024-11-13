import { Avatar } from "../shared/users/Avatar";
import img from "../../assets/jennie.jpeg";

interface ChatGroupProps {
  name: string;
}

export const ChatGroup = ({ name }: ChatGroupProps) => {
  return (
    <div className="mt-10 flex flex-row items-center justify-start border-y-[1px] p-2">
      <Avatar src={img} />
      <p className="">{name}</p>
    </div>
  );
};
