import { Button } from "@components/shared/Buttons/GenericButton";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export const EmptyChat = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-bgd-color text-txt-color">
      <ChatBubbleLeftRightIcon className="w-32 h-32 text-gray-400" />
      <p>Send a message to start a dialogue.</p>
      <Button title={"Send message"} styles="w-auto mt-4" />
    </div>
  );
};
