import { Button } from "../shared/Buttons/GenericButton";
import { ChatGroup } from "./ChatGroup";
import { useCookies } from "react-cookie";

export const ChatGroupsContainer = () => {
  const [, removeCookie] = useCookies(['accessToken'])
  return (
    <>
      <div className="absolute h-10 flex items-center justify-center px-4">
        <p>Chats</p>
      </div>
      <ChatGroup/>
      <Button title="Log Out" styles="mt-auto" onClick={(e)=>{
        e.preventDefault()
        removeCookie("accessToken",null)}
        }
      />
    </>
  );
};
