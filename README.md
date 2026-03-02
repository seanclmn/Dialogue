# Dialogue

A full-stack web chat application written in TypeScript.

## Tech stack

- **UI:** TypeScript, React, React Relay, Tailwind CSS, Vite
- **API:** TypeScript, NestJS, GraphQL (Apollo), TypeORM
- **Database:** MySQL

## Setup

### 1. Install dependencies

```bash
# Client
cd client && npm install

# Server
cd ts-server && npm install
```

### 2. Configure the server

Set up your MySQL database and configure the server (e.g. via environment variables or config in `ts-server`). The API uses TypeORM with MySQL.

### 3. Sync GraphQL schema (client)

After the server is running at least once (or if `ts-server/src/schema.graphql` exists), pull the schema into the client:

```bash
cd client && npm run graphql:generate
```

Or copy it manually:

```bash
cp ts-server/src/schema.graphql client/schema.graphql
```

### 4. Run Relay compiler (client)

Generate Relay artifacts from your GraphQL usage:

```bash
cd client && npm run relay
```

## Running the app

**API (NestJS):**

```bash
cd ts-server
npm run start:dev
```

**Client (Vite):**

```bash
cd client
npm run dev
```

Open the client URL (e.g. `http://localhost:5173`) in your browser.

## Scripts

**Client**

| Script                     | Description                           |
| -------------------------- | ------------------------------------- |
| `npm run dev`              | Start Vite dev server                 |
| `npm run build`            | Relay compile, TypeScript, Vite build |
| `npm run relay`            | Run Relay compiler                    |
| `npm run graphql:generate` | Copy schema from server to client     |
| `npm run preview`          | Preview production build              |
| `npm run lint`             | Run ESLint                            |

**Server**

| Script              | Description                  |
| ------------------- | ---------------------------- |
| `npm run start:dev` | Start Nest in watch mode     |
| `npm run start`     | Start Nest (and copy schema) |
| `npm run build`     | Build Nest app               |
| `npm run seed`      | Run database seed            |
| `npm run lint`      | Run ESLint                   |

---

## Relay-style schema design

The GraphQL API follows a Relay-style schema. Every object implements the `Node` interface with a unique global ID. Lists are exposed as **connections** with edges and cursor-based pagination.

### Example schema

From `ts-server/src/schema.graphql` (core types used by the client):

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

type Subscription {
  newMessage(chatIds: [ID!]!): ChatUpdate!
}

type ChatUpdate {
  chatId: String!
  newMessage: Message!
}
```

### Client usage

Components use fragments and hooks. The Relay compiler turns `graphql` literals into artifacts; data is loaded via `usePaginationFragment`, `usePreloadedQuery`, etc.

**Root query** (`Page.tsx`): load current user and compose fragments for chats and notifications:

```graphql
query PageQuery {
  currentUser {
    username
    id
    bio
    friends {
      edges {
        node {
          id
        }
      }
    }
    ...Chats_user
    ...NotificationsList_user
  }
}
```

**Paginated messages fragment** (`Messages.tsx`): refetchable connection with scroll-to-load more:

```typescript
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

export const Messages = ({ fragmentKey }: MessagesProps) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(fragment, fragmentKey);
  const userContext = useContext(UserContext);
  // ... scroll handler calls loadNext(20) when user scrolls to top
  return (
    <div ref={containerRef} className="w-full h-full overflow-auto flex flex-col-reverse">
      {data.messages.edges.map((edge) => (
        <Message
          date={edge.node.createdAt}
          text={edge.node.text}
          id={edge.node.id}
          key={edge.node.id}
          senderIsMe={userContext.user?.id === edge.node.userId}
        />
      ))}
      {isLoadingNext ? <Loader /> : null}
      {!hasNext ? <p>Dialogue started!</p> : null}
    </div>
  );
};
```

**Real-time subscription** (`Page.tsx`): subscribe to new messages and update the Relay store:

```graphql
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
```
