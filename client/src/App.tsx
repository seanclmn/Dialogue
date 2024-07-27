import { useState } from "react";
import "./App.css";
import { ChatInput } from "./components/shared/Inputs/ChatInput";
import { Message, MessageProps } from "./components/shared/Messages/Message";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<MessageProps[]>([]);
  console.log(conversation);

  return (
    <div>
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
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          console.log("new message: ", message);
          setConversation([...conversation, { text: message, id: uuidv4() }]);
          setMessage("");
        }}
      >
        <ChatInput
          value={message}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setMessage(e.currentTarget.value)
          }
        />
      </form>
    </div>
  );
}

export default App;
