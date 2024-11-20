import { ConnectionHandler, graphql, GraphQLSubscriptionConfig, RecordProxy } from "relay-runtime";
import "./App.css";
import { ChatContainer } from "./components/chat/ChatContainer";
import { ChatGroupsContainer } from "./components/chat/ChatGroupsContainer";
import { ChatHeader } from "./components/chat/ChatHeader";
import { Suspense, useContext, useEffect, useMemo } from "react";
import { PreloadedQuery, usePreloadedQuery, useQueryLoader, useSubscription } from "react-relay";
import { PageQuery } from "@generated/PageQuery.graphql";
import { Loader } from "@components/shared/loaders/Loader";
import { UserContext } from "./UserContext";
import { Outlet, useParams } from "react-router";
import { RenderErrorBoundary } from "react-router/dist/lib/hooks";

const query = graphql`
  query PageQuery {
    currentUser {
      username
      id
      ...ChatGroupsContainer_user
    }
  }
`

// const subscription = graphql`
//   subscription PageChatsSubscription($chatIds: [ID!]!) {
//     newMessage(chatIds: $chatIds) {
//       createdAt
//       id
//       text
//       userId
//     }
//   }
// `

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
  const userContext = useContext(UserContext)
  // const config: GraphQLSubscriptionConfig<ChatContainerSubscription> = useMemo(() => ({
  //   subscription: subscription,
  //   variables: { chatIds },
  //   onNext: (res) => {
  //     if (res?.addMessage) {
  //       console.log(res.addMessage)
  //     }
  //   },
  //   updater: (store) => {

  //     const payload: RecordProxy<PageChatsSubscription$data> = store.getRootField("addMessage")

  //     const chatRecord = store.get(payload);
  //     if (!chatRecord) return;

  //     const connection = ConnectionHandler.getConnection(chatRecord, "Messages_messages")
  //     if (!connection) return;

  //     const newEdge = ConnectionHandler.createEdge(
  //       store,
  //       connection,
  //       payload,
  //       'MessageEdge'
  //     );

  //     ConnectionHandler.insertEdgeAfter(connection, newEdge);
  //   },
  //   onError: (e) => {
  //     console.log(e)
  //   },
  //   onCompleted: () => {
  //     console.log("completed")
  //   }
  // }), [chatIds]);


  // useSubscription(config)


  useEffect(() => {
    console.log(currentUser)
    userContext?.setUser({ id: currentUser.id, username: currentUser.username })
  }, [currentUser.username])
  if (!currentUser.id) return <Loader />

  return (
    <div className="flex flex-row items-start h-full">
      <div className="h-[100vh] border-solid border-r-[1px] w-40">
        <Suspense fallback={<Loader />}>
          <ChatGroupsContainer fragmentKey={currentUser} />
        </Suspense>
      </div>
      <div className="h-[100vh] w-[100%] flex-grow relative">
        <Outlet />
      </div>
    </div>
  );
}

export default Page;
