import { Message } from "@components/shared/Messages/Message";
import { Messages_chat$key } from "@generated/Messages_chat.graphql";
import { useContext, useEffect, useRef, useState } from "react";
import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { UserContext } from "../../contexts/UserContext";

const fragment = graphql`
  fragment Messages_chat on Chat
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 20 }
    after: { type: "String" }
  )
  @refetchable(queryName: "MessagesRefetchQuery") {
    messages(first: $first, after: $after)
      @connection(key: "Messages_messages") {
      edges {
        cursor
        node {
          id
          text
          createdAt
          userId
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

type MessagesProps = {
  fragmentKey: Messages_chat$key;
};

export const Messages = ({ fragmentKey }: MessagesProps) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(fragment, fragmentKey);
  const [isAtTop, setIsAtTop] = useState(false);
  const userContext = useContext(UserContext);
  const endMessagesRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (endMessagesRef.current)
      endMessagesRef.current.scrollIntoView({ behavior: "auto" });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const isNowAtTop = container.scrollTop < 100;
      setIsAtTop(isNowAtTop);
      if (isNowAtTop && hasNext) {
        console.log("Loading next messages...");
        loadNext(20); // Load 10 more messages
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasNext, isLoadingNext, loadNext]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto">
      {data.messages.edges.map((edge) => {
        return (
          <Message
            date={edge.node.createdAt}
            text={edge.node.text}
            id={edge.node.id}
            key={edge.node.id}
            senderIsMe={userContext.user?.id === edge.node.userId}
          />
        );
      })}
      <div ref={endMessagesRef} className="h-1" />
    </div>
  );
};
