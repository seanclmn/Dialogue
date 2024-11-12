import { graphql } from "relay-runtime";
import "./App.css";
import { ChatContainer } from "./components/chat/ChatContainer";
import { ChatGroupsContainer } from "./components/chat/ChatGroupsContainer";
import { ChatHeader } from "./components/chat/ChatHeader";
import { Suspense, useEffect } from "react";
import { PreloadedQuery, usePreloadedQuery, useQueryLoader } from "react-relay";
import { PageQuery } from "@generated/PageQuery.graphql";
import { Loader } from "@components/shared/loaders/Loader";

const query = graphql`
  query PageQuery {
    currentUser {
      username
      id
      chats {
        name
        id
        participants {
          username
        }
      }
    }
  }
`

const Page = () => {
  const [queryReference, loadQuery] = useQueryLoader<PageQuery>(query);

  useEffect(() => {
    loadQuery({})
  }, [])

  if (!queryReference) return null

  return (
    <Suspense fallback={<div />}>
      <Content queryReference={queryReference} />
    </Suspense>
  )
}

type ContentProps = {
  queryReference: PreloadedQuery<PageQuery>
}

const Content = ({ queryReference }: ContentProps) => {

  const { currentUser } = usePreloadedQuery(query, queryReference)

  useEffect(() => {
    console.log(currentUser)
  }, [currentUser.username])
  if (!currentUser.chats) return <Loader />

  return (
    <div className="flex flex-row items-start h-full">
      <div className="h-[100vh] border-solid border-r-[1px] w-40">
        <ChatGroupsContainer />
      </div>
      <div className="h-[100vh] w-[100%] flex-grow relative">
        <ChatHeader title={currentUser.chats[0].name} style="absolute" />
        <div className="px-2 pt-2 h-full">
          <ChatContainer id={currentUser.chats[0].id} />
        </div>
      </div>
    </div>
  );
}

export default Page;
