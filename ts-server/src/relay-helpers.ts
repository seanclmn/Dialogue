import { PageInfo } from "./relay";



type EdgeType<Type = any> = {
  cursor: string;

  node: Type;
}

type ConnectionType<T> = {
  edges: EdgeType<T>[];

  pageInfo: PageInfo;
}

export type ConnectionArgs = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
};

export function encodeDateCursor(date: Date) {
  return Buffer.from(date.toISOString()).toString("base64");
}

export function decodeDateCursor(cursor?: string): Date | null {
  if (!cursor) return null;
  return new Date(Buffer.from(cursor, "base64").toString("ascii"));
}

export function encodeCursor(offset: number) {
  return Buffer.from(offset.toString()).toString("base64");
}

export function decodeCursor(cursor?: string) {
  if (!cursor) return 0;
  return parseInt(Buffer.from(cursor, "base64").toString("ascii"), 10);
}

export function relayToOffset(first: number, after: string) {
  const take = first ?? 20;
  const skip = after
    ? decodeCursor(after)
    : 0;

  return { take, skip };
}


export function buildRelayConnection<ItemType>(items: ItemType[], totalCount: number, { first, after }: ConnectionArgs): ConnectionType<ItemType> {
  const take = first ?? items.length;
  const skip = after ? decodeCursor(after) : 0;

  const edges = items.map((item, index) => ({
    node: item,
    cursor: encodeCursor(skip + index + 1),
  }));

  return {
    edges,
    pageInfo: {
      hasNextPage: skip + take < totalCount,
      hasPreviousPage: skip > 0,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
    },
  };
} 