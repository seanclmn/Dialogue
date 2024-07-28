import { useState } from "react";
import { ChatInput } from "./components/shared/Inputs/ChatInput";
import { Message, MessageProps } from "./components/shared/Messages/Message";
import { v4 as uuidv4 } from "uuid";

import "./App.css";
import { ChatSendButton } from "./components/shared/Buttons/ChatSendButton";

function App() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<MessageProps[]>([]);

  return (
    <>
      <>
        {conversation.map((messageObj) => (
          <Message
            text={messageObj.text}
            id={messageObj.id}
            key={messageObj.id}
          />
        ))}
      </>
      <form
        className="border-[1px] rounded-[15px] 
        w-[100%] mx-0 px-[1rem] py-[4px] border-black 
        flex items-center
        "
        onSubmit={(e: React.KeyboardEvent<HTMLFormElement>) => {
          e.preventDefault();
          console.log("new message: ", message);
          setConversation([...conversation, { text: message, id: uuidv4() }]);
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
    </>
  );
}

export default App;
