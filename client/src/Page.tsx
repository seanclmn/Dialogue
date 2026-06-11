import {
  ConnectionHandler,
  graphql,
  requestSubscription,
} from "relay-runtime";
import { Suspense, useContext, useEffect } from "react";
import {
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useRelayEnvironment,
} from "react-relay";
import { PageQuery } from "@generated/PageQuery.graphql";
import { Loader } from "@components/shared/loaders/Loader";
import { UserContext } from "./contexts/UserContext";
import { Outlet} from "react-router";
import { PageChatsSubscription } from "@generated/PageChatsSubscription.graphql";
import { Nav } from "@components/nav/Nav";
import { Link } from "react-router";

const query = graphql`
  query PageQuery {
    currentUser {
      username
      id
      bio
      avatarUrl
      friends {
        edges {
          node {
            id
            username
            avatarUrl
          }
        }
      }
      ...Chats_user
      ...NotificationsList_user
    }
  }
`;

const subscription = graphql`
  subscription PageChatsSubscription($chatIds: [ID!]!) {
    newMessage(chatIds: $chatIds) {
      chatId
      newMessage {
        createdAt
        id
        text
        gifUrl
        gifWidth
        gifHeight
        userId
      }
    }
  }
`;

const Page = () => {
  const [queryReference, loadQuery] = useQueryLoader<PageQuery>(query);
  const { setCurrentUserRef } = useContext(UserContext);

  useEffect(() => {
    setCurrentUserRef(null);
    loadQuery({}, { fetchPolicy: "network-only" });
  }, []);

  if (!queryReference) return <Loader />;

  return (
    <Suspense fallback={<Loader />}>
      <Content queryReference={queryReference} />
    </Suspense>
  );
};

type ContentProps = {
  queryReference: PreloadedQuery<PageQuery>;
};

const Content = ({ queryReference }: ContentProps) => {
  const { currentUser } = usePreloadedQuery(query, queryReference);
  const { user, setUser, setCurrentUserRef } = useContext(UserContext);
  const environment = useRelayEnvironment();

  // Re-subscribe whenever the set of chat IDs changes. Relay's useSubscription
  // captures variables at mount time and never updates them, so we manage the
  // subscription lifecycle manually so that events are received as soon as
  // chatIds are populated (and again if new chats are created).
  useEffect(() => {
    if (!user.chatIds.length) return;

    const sub = requestSubscription<PageChatsSubscription>(environment, {
      subscription,
      variables: { chatIds: user.chatIds },
      updater: (store) => {
        const newMessageField = store.getRootField("newMessage");
        if (!newMessageField) return;

        const chatId = newMessageField.getValue("chatId") as string;
        const newMessageNode = newMessageField.getLinkedRecord("newMessage");
        if (!chatId || !newMessageNode) return;

        const chatRecord = store.get(chatId);
        if (!chatRecord) return;

        chatRecord.setLinkedRecord(newMessageNode, "lastMessage");

        const messagesConnection = ConnectionHandler.getConnection(
          chatRecord,
          "Messages_messages",
        );
        if (!messagesConnection) return;

        const newEdge = ConnectionHandler.createEdge(
          store,
          messagesConnection,
          newMessageNode,
          "MessageEdge",
        );

        ConnectionHandler.insertEdgeBefore(messagesConnection, newEdge);
      },
      onError: (e) => {
        console.log(e);
      },
      onCompleted: () => {
        console.log("completed");
      },
    });

    return () => sub.dispose();
  }, [user.chatIds.join(","), environment]);

  useEffect(() => {
    setUser({
      ...user,
      id: currentUser.id,
      username: currentUser.username,
      bio: currentUser.bio ?? "",
      avatarUrl: currentUser.avatarUrl ?? null,
      friends: (currentUser.friends?.edges ?? []).map((edge) => ({
        id: edge.node.id,
        username: edge.node.username,
        avatarUrl: edge.node.avatarUrl ?? null,
      })),
    });
    setCurrentUserRef(currentUser);
  }, [currentUser.id]);

  if (!currentUser.id) return <Loader />;

  return (
    <>
      <div className="flex flex-col h-[100vh] items-left bg-bgd-color text-txt-color">
        <Link
          to={"/"}
          className="cursor-pointer px-4 border-b-[1px] border-brd-color bg-bgd-color"
        >
          <p className="text-3xl py-4 cedarville-cursive-regular">Dialogue</p>
        </Link>
        <div className="flex flex-row items-start flex-grow flex-1 h-1">
          <Nav />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Page;
