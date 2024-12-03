import { Avatar } from "../shared/users/Avatar";
import img from "../../assets/jennie.jpeg";
import { Link, useParams } from "react-router-dom";

interface ChatGroupProps {
  name: string;
  chatId: string;
  lastMessage: string;
}

export const ChatGroup = ({ name, chatId, lastMessage }: ChatGroupProps) => {
  const { id } = useParams()
  return (
    <Link to={`/chats/${chatId}`} >
      <div className={`
        flex flex-row items-center 
        justify-start p-2 h-18 
        hover:bg-bgd-highlight 
        ${id === chatId ? "bg-bgd-highlight" : ""}`}>
        <Avatar src={img} containerStyle="h-14" />
        <div className="mx-2 h-full flex flex-col justify-between">
          <p className="text-sm font-bold mb-1">{name}</p>
          <p className="text-xs">{lastMessage}</p>
        </div>
      </div>
    </Link>
  );
};
