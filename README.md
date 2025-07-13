### A full stack web chat application written in Typescript

### Tools:
- UI: Typescript, ReactJS, React-Relay, Tailwind
- API: Typescript, NestJS, GraphQL, TypeORM
- Database: MySQL

### Relay Style Schema Design

The GraphQL API follows a Relay style GraphQL schema. Every object implements a Node interface, with a unique global ID. Instead of a list of items, we return a connection with edges to item nodes, with cursor style pagination data. Here is a snippet of the schema file:

```graphql
type Chat implements Node {
  createdAt: DateTime!
  id: ID!
  lastMessage: Message
  messages(after: String, first: Int): MessageConnection!
  name: String!
  participants: [User!]
}

type MessageConnection {
  edges: [MessageEdge!]!
  pageInfo: PageInfo!
}

type MessageEdge {
  cursor: String!
  node: Message!
}

type Message implements Node {
  chat: Chat!
  createdAt: DateTime!
  id: ID!
  text: String!
  userId: String!
}

type PageInfo {
  endCursor: String!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String!
}
```

On the client side we statically compose many data fragments, like the one below, into one big query with the Relay compiler. We write queries and fragments per component with a GraphQL string, and load the data into the React component using a hook. In this case we use a refetchable paginated query:

```typescript
const fragment = graphql`
  fragment Messages_chat on Chat
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 300 }
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
  const { data } = usePaginationFragment(fragment, fragmentKey);
  const userContext = useContext(UserContext);
  const endMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (endMessagesRef.current)
      endMessagesRef.current.scrollIntoView({ behavior: "auto" });
  }, [data.messages.edges.length]);

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
        );
      })}
      <div ref={endMessagesRef} />
    </>
  );
};
```
