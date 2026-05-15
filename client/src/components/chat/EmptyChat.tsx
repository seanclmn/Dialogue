import { Button } from "@components/shared/Buttons/Button";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

interface EmptyChatProps {
  onNewChat?: () => void;
}

export const EmptyChat = ({ onNewChat }: EmptyChatProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-bgd-color text-txt-color">
      <ChatBubbleLeftRightIcon className="w-32 h-32 text-gray-400" />
      <p>Send a message to start a dialogue.</p>
      <Button styles="w-auto mt-4" onClick={onNewChat}>Send a new message</Button>
    </div>
  );
};
