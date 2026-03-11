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
    gifUrl?: string;
  } | null;
}

export const ChatGroup = ({ name, chatId, lastMessage }: ChatGroupProps) => {
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
          <p className="text-sm font-bold mb-1 text-txt-color">{name}</p>
          {lastMessage ? (
            <LastMessage lastMessage={lastMessage} />
          ) : (
            <p className="text-xs">Say hi!</p>
          )}
        </div>
      </div>
    </Link>
  );
};

const LastMessage = ({ lastMessage }: { lastMessage: { text: string; userId: string; gifUrl?: string } }) => {
  const userContext = useContext(UserContext);


  if(lastMessage.gifUrl) {
    return (
      <p className="text-xs">
        {userContext.user.id === lastMessage.userId ? <b>You sent a gif </b> : <b>{lastMessage.userId} sent a gif </b>}
      </p>
    );
  }

  return (
    <p className="text-xs">
      {userContext.user.id === lastMessage.userId ? <b>You: </b> : <b>{lastMessage.userId}: </b>}
      {lastMessage.text.length > 20
        ? lastMessage.text.slice(0, 20) + "..."
        : lastMessage.text}
    </p>
  );
};
