import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Message, MessageProps } from "../shared/Messages/Message";
import { ChatInput } from "../shared/Inputs/ChatInput";
import { ChatSendButton } from "../shared/Buttons/ChatSendButton";

export const ChatContainer = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<MessageProps[]>([]);

  return (
    <div className="m-2 h-full flex flex-col justify-between">
      <div className="flex flex-col items-start">
        <Message text={"sup"} id={"asdfasdf"} key={"asdfasdf"} />
        {conversation.map((messageObj) => (
          <Message
            text={messageObj.text}
            id={messageObj.id}
            key={messageObj.id}
            senderIsMe
          />
        ))}
      </div>
      <form
        className="border-[1px] rounded-[15px] 
         my-2 px-[1rem] py-[4px] 
        border-black flex items-center
        "
        onSubmit={(e: React.KeyboardEvent<HTMLFormElement>) => {
          e.preventDefault();
          console.log("new message: ", message);
          setConversation([
            ...conversation,
            { text: message, id: uuidv4(), senderIsMe: true },
          ]);
          setMessage("");
        }}
      >
        <ChatInput
          value={message}
          onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
            console.log("onchange");
            e.preventDefault();
            setMessage(e.currentTarget.value);
          }}
        />
        <ChatSendButton />
      </form>
    </div>
  );
};
