import { Message } from "@components/shared/Messages/Message";
import { Messages_chat$key } from "@generated/Messages_chat.graphql";
import { Loader } from "@components/shared/loaders/Loader";
import { UserContext } from "../../contexts/UserContext";
import { useContext, useEffect, useRef } from "react";
import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";

const fragment = graphql`
  fragment Messages_chat on Chat
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 10 }
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
          gifUrl
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
  const userContext = useContext(UserContext);
  const endMessagesRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const previousIntersecting = useRef(false);

  useEffect(() => {
    if (endMessagesRef.current)
      endMessagesRef.current.scrollIntoView({ behavior: "auto" });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const loadMore = loadMoreRef.current;
    if (!container || !loadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const nowIntersecting = entry.isIntersecting;
        if (
          nowIntersecting &&
          !previousIntersecting.current &&
          hasNext &&
          !isLoadingNext
        ) {
          loadNext(10);
        }
        previousIntersecting.current = nowIntersecting;
      },
      {
        root: container,
        rootMargin: "0px",
        threshold: 0,
      },
    );

    observer.observe(loadMore);
    return () => observer.disconnect();
  }, [hasNext, isLoadingNext, loadNext]);


  return (
    <div ref={containerRef} className="w-full h-full overflow-auto flex flex-col-reverse">
      <div ref={endMessagesRef} className="h-1" />
      {data.messages.edges.map((edge, index) => {

        const currentMessageDate = new Date(edge.node.createdAt);
        return (
          <Message
            props={{
              previousMessageUserId: data.messages.edges[index + 1]?.node?.userId,
              nextMessageUserId: data.messages.edges[index - 1]?.node?.userId,
              previousMessageDate: data.messages.edges[index + 1]?.node?.createdAt,
              nextMessageDate: data.messages.edges[index - 1]?.node?.createdAt,
              date: currentMessageDate.toLocaleString(),
              text: edge.node.text,
              gifUrl: edge.node.gifUrl,
              id: edge.node.id,
              userId: edge.node.userId,
            }}
            key={edge.node.id}
            />
        );
      })}
      <div className="w-full flex flex-col items-center my-2">
        {isLoadingNext ? <Loader /> : null}
      </div>
      <div
        ref={loadMoreRef}
        className="h-1 w-full shrink-0"
        aria-hidden
      />
      {!hasNext ? (
        <p className="text-center text-gray-500 my-4">Dialogue started!</p>
      ) : null}
    </div>
  );
};
