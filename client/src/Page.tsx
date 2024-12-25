import { ConnectionHandler, graphql, GraphQLSubscriptionConfig, RecordProxy, RecordSourceProxy } from "relay-runtime";
import "./App.css";
import { Suspense, useContext, useEffect, useMemo } from "react";
import { PreloadedQuery, usePreloadedQuery, useQueryLoader, useSubscription } from "react-relay";
import { PageQuery } from "@generated/PageQuery.graphql";
import { Loader } from "@components/shared/loaders/Loader";
import { UserContext } from "./UserContext";
import { Outlet, useParams } from "react-router";
import { PageChatsSubscription } from "@generated/PageChatsSubscription.graphql";
import { Nav } from "@components/nav/Nav";
import { Link } from "react-router";
import img from "../src/assets/logo.png"

const query = graphql`
  query PageQuery {
    currentUser {
      username
      id
      friends {
        edges {
          node {
            id
          }
        }
      }
      ...ChatGroupsContainer_user
    }
  }
`

const subscription = graphql`
  subscription PageChatsSubscription($chatIds: [ID!]!) {
    newMessage(chatIds: $chatIds) {
      chatId   
      newMessage {
        createdAt
        id
        text
        userId
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
  const { user, setUser } = useContext(UserContext)
  const config: GraphQLSubscriptionConfig<PageChatsSubscription> = useMemo(() => ({
    subscription: subscription,
    variables: { chatIds: user.chatIds },
    updater: (store) => {
      const newMessageField = store.getRootField('newMessage');
      if (!newMessageField) return;

      const chatId = newMessageField.getValue('chatId') as string;
      const newMessageNode = newMessageField.getLinkedRecord('newMessage');
      if (!chatId || !newMessageNode) return;

      const chatRecord = store.get(chatId);
      if (!chatRecord) return;

      chatRecord?.setLinkedRecord(newMessageNode, 'lastMessage')

      const messagesConnection = ConnectionHandler.getConnection(chatRecord, "Messages_messages");
      if (!messagesConnection) return;

      const newEdge = ConnectionHandler.createEdge(store, messagesConnection, newMessageNode, 'MessageEdge')

      ConnectionHandler.insertEdgeAfter(messagesConnection, newEdge)
    },
    onError: (e) => {
      console.log(e)
    },
    onCompleted: () => {
      console.log("completed")
    }
  }), [user?.chatIds]);

  useSubscription(config)

  useEffect(() => {
    setUser({
      ...user,
      id: currentUser.id,
      username: currentUser.username
    })
  }, [currentUser.username])

  if (!currentUser.id) return <Loader />

  return (
    <>

      <div className="flex flex-col h-[100vh] items-left">
        <Link to={"/"} className="cursor-pointer px-4 border-b-[1px] border-brd-color">
          <img src={img} className="h-12 my-2 mr-auto" />
        </Link>
        <div className="flex flex-row items-start flex-grow flex-1 h-1">
          <Nav />
          <Outlet />
        </div>

      </div>

    </>
  );
}

export default Page;
