import { Avatar } from "../shared/users/Avatar";
import img from "../../assets/jennie.jpeg";
import { Link, useParams } from "react-router";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

interface ChatGroupProps {
  name: string;
  chatId: string;
  lastMessage?: {
    text: string;
    userId: string;
  } | null;
}

export const ChatGroup = ({ name, chatId, lastMessage }: ChatGroupProps) => {
  const userContext = useContext(UserContext);
  const { id } = useParams();
  return (
    <Link to={`/chats/${chatId}`}>
      <div
        className={`
        flex flex-row items-center 
        justify-start p-2 h-18 
        hover:bg-bgd-highlight 
        ${id === chatId ? "bg-bgd-highlight" : ""}`}
      >
        <Avatar src={img} containerStyle="h-14" />
        <div className="mx-2 h-full flex flex-col justify-between">
          <p className="text-sm font-bold mb-1">{name}</p>
          {lastMessage ? (
            <p className="text-xs">
              {userContext.user.id === lastMessage.userId ? <b>Me: </b> : null}
              {lastMessage.text.length > 20
                ? lastMessage.text.slice(0, 20) + "..."
                : lastMessage.text}
            </p>
          ) : (
            <p>Say hi!</p>
          )}
        </div>
      </div>
    </Link>
  );
};
