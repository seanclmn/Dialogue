import "./App.css";
import { ChatContainer } from "./components/chat/ChatContainer";

function App() {
  return (
    <div className="h-[100vh]">
      <div className="px-2 pt-2 h-full">
        <ChatContainer />
      </div>
    </div>
  );
}

export default App;
