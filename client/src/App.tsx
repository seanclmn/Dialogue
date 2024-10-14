import { graphql } from "relay-runtime";
import "./App.css";
import { ChatContainer } from "./components/chat/ChatContainer";
import { ChatGroupsContainer } from "./components/chat/ChatGroupsContainer";
import { ChatHeader } from "./components/chat/ChatHeader";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router";

function App() {

  const [cookies,] = useCookies(['accessToken']);

  if (!cookies['accessToken']) return <Navigate to='login' />

  return (
    <div className="flex flex-row items-start h-full">
      <div className="h-[100vh] border-solid border-r-[1px] w-40">
        <ChatGroupsContainer />
      </div>
      <div className="h-[100vh] w-[100%] flex-grow relative">
        <ChatHeader title={"wonton"} style="absolute" />
        <div className="px-2 pt-2 h-full">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
