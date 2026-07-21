import { Message } from "@components/shared/Messages/Message";
import { Messages_chat$key } from "@generated/Messages_chat.graphql";
import { Loader } from "@components/shared/loaders/Loader";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { useVirtualizer } from "@tanstack/react-virtual";

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
          gifWidth
          gifHeight
          createdAt
          userId
          username
          parentMessageId
          parentMessage {
            id
            text
            gifUrl
            username
          }
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
  participantAvatars: Record<string, string | null>;
  onReply?: (message: { id: string; text: string; gifUrl?: string | null; username: string }) => void;
};

export const Messages = ({ fragmentKey, participantAvatars, onReply }: MessagesProps) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(fragment, fragmentKey);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const previousIntersecting = useRef(false);

  // Track scroll state for auto-scroll and position preservation
  const isAtBottom = useRef(true);
  const prevEdgesLength = useRef(0);
  const savedScrollBottom = useRef(0);
  const isPaginating = useRef(false);

  // Reverse so index 0 = oldest, last index = newest (normal top-to-bottom order)
  const edges = [...data.messages.edges].reverse();

  const virtualizer = useVirtualizer({
    count: edges.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Scroll to bottom on initial load; preserve scroll when paginating
  useLayoutEffect(() => {
    const container = parentRef.current;
    if (!container) return;

    if (prevEdgesLength.current === 0 && edges.length > 0) {
      // Initial load — jump to bottom
      container.scrollTop = container.scrollHeight;
    } else if (edges.length > prevEdgesLength.current) {
      if (isPaginating.current) {
        // Older messages prepended — restore position relative to bottom
        container.scrollTop = container.scrollHeight - savedScrollBottom.current;
        isPaginating.current = false;
      } else if (isAtBottom.current) {
        // New message appended — follow to bottom
        virtualizer.scrollToIndex(edges.length - 1, { align: "end" });
      }
    }

    prevEdgesLength.current = edges.length;
  }, [edges.length]);

  // Track whether user is near the bottom
  const handleScroll = () => {
    const container = parentRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    isAtBottom.current = scrollHeight - scrollTop - clientHeight < 120;
  };

  // IntersectionObserver to load older messages when top sentinel is visible
  useEffect(() => {
    const container = parentRef.current;
    const loadMore = loadMoreRef.current;
    if (!container || !loadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const nowIntersecting = entry.isIntersecting;
        if (nowIntersecting && !previousIntersecting.current && hasNext && !isLoadingNext) {
          savedScrollBottom.current = container.scrollHeight - container.scrollTop;
          isPaginating.current = true;
          loadNext(10);
        }
        previousIntersecting.current = nowIntersecting;
      },
      { root: container, rootMargin: "0px", threshold: 0 },
    );

    observer.observe(loadMore);
    return () => observer.disconnect();
  }, [hasNext, isLoadingNext, loadNext]);

  return (
    <div
      ref={parentRef}
      onScroll={handleScroll}
      className="w-full h-full overflow-auto"
    >
      {/* Top sentinel triggers pagination when scrolled into view */}
      <div ref={loadMoreRef} className="h-1 w-full shrink-0" aria-hidden />
      {!hasNext ? (
        <p className="text-center text-gray-500 my-4">Dialogue started!</p>
      ) : null}
      {isLoadingNext ? (
        <div className="w-full flex flex-col items-center my-2">
          <Loader />
        </div>
      ) : null}

      {/* Virtual list container */}
      <div
        style={{ height: `${virtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}
      >
        {virtualItems.map((virtualItem) => {
          const edge = edges[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <Message
                id={edge.node.id}
                text={edge.node.text}
                date={new Date(edge.node.createdAt).toLocaleString()}
                gifUrl={edge.node.gifUrl}
                gifWidth={edge.node.gifWidth ?? undefined}
                gifHeight={edge.node.gifHeight ?? undefined}
                userId={edge.node.userId}
                senderAvatarUrl={participantAvatars[edge.node.userId] ?? null}
                senderUsername={edge.node.username}
                previousMessageUserId={edges[virtualItem.index - 1]?.node?.userId}
                nextMessageUserId={edges[virtualItem.index + 1]?.node?.userId}
                previousMessageDate={edges[virtualItem.index - 1]?.node?.createdAt}
                nextMessageDate={edges[virtualItem.index + 1]?.node?.createdAt}
                parentMessageId={edge.node.parentMessageId}
                parentMessageText={edge.node.parentMessage?.text}
                parentMessageGifUrl={edge.node.parentMessage?.gifUrl}
                parentMessageUsername={edge.node.parentMessage?.username}
                onReply={
                  // Replies are single-level (no threads), so a reply can't itself be replied to.
                  onReply && !edge.node.parentMessageId
                    ? () =>
                        onReply({
                          id: edge.node.id,
                          text: edge.node.text,
                          gifUrl: edge.node.gifUrl,
                          username: edge.node.username,
                        })
                    : undefined
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
