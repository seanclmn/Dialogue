import { Avatar } from "../shared/users/Avatar";
import img from "../../assets/jennie.jpeg";
import { Link } from "react-router-dom";

interface ChatGroupProps {
  name: string;
  chatId: string;
}

export const ChatGroup = ({ name, chatId }: ChatGroupProps) => {
  return (
    <Link to={`chats/${chatId}`} >
      <div className="mt-10 flex flex-row items-center justify-start border-y-[1px] p-2">
        <Avatar src={img} />
        <p className="">{name}</p>
      </div>
    </Link>

  );
};
