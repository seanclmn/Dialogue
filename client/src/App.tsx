import { graphql } from "relay-runtime";
import "./App.css";
import { ChatContainer } from "./components/chat/ChatContainer";
import { ChatGroupsContainer } from "./components/chat/ChatGroupsContainer";
import { ChatHeader } from "./components/chat/ChatHeader";
import { useLazyLoadQuery } from "react-relay";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router";

const query = graphql`
  query AppQuery($username: String!) {
    user(username: $username) {
      username
      id
    }
  }
`;

function App() {
  // const data = useLazyLoadQuery(
  //   query,
  //   { username: 'seanclmn' },
  //   { fetchPolicy: "store-or-network" }
  // );

  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);

  if(!cookies['accessToken']) return <Navigate to='login' />

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
