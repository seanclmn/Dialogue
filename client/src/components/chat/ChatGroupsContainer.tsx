import { ChatGroup } from "./ChatGroup";

export const ChatGroupsContainer = () => {
  return (
    <>
      <div className="absolute h-10 flex items-center justify-center px-4">
        <p>Chats</p>
      </div>
      <ChatGroup />
    </>
  );
};
