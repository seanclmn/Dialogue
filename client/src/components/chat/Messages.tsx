import { Message } from "@components/shared/Messages/Message";
import { Messages_chat$key } from "@generated/Messages_chat.graphql";
import { DOMElement, useContext, useEffect, useRef } from "react";
import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { UserContext } from "../../UserContext";

const fragment = graphql`
  fragment Messages_chat on Chat
  @argumentDefinitions(
    first: {type: "Int", defaultValue: 300},
    after: {type: "String"}
  )
  @refetchable(queryName: "MessagesRefetchQuery") {
    messages(first: $first, after: $after)
    @connection(key: "Messages_messages")
    {
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
`

type MessagesProps = {
  fragmentKey: Messages_chat$key
}

export const Messages = ({ fragmentKey }: MessagesProps) => {
  const { data } = usePaginationFragment(fragment, fragmentKey)
  const userContext = useContext(UserContext)
  const endMessagesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (endMessagesRef.current)
      endMessagesRef.current.scrollIntoView({ behavior: "auto" })
  }, [data.messages.edges.length])

  return (
    <>
      {data.messages.edges.map((edge) => {
        return (
          <Message
            text={edge.node.text}
            id={edge.node.id}
            key={edge.node.id}
            senderIsMe={userContext.user?.id === edge.node.userId}
          />
        )
      })}
      <div ref={endMessagesRef} />
    </>
  )
}