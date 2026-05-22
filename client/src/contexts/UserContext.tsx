import { createContext, ReactNode, useState } from "react";
import { Chats_user$key } from "@generated/Chats_user.graphql";
import { NotificationsList_user$key } from "@generated/NotificationsList_user.graphql";

export interface Friend {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface User {
  id: string | null;
  username: string | null;
  chatIds: string[];
  bio: string | null;
  avatarUrl: string | null;
  friends: Friend[];
}

export type CurrentUserRef = Chats_user$key | NotificationsList_user$key;

export interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  currentUserRef: CurrentUserRef | null;
  setCurrentUserRef: (ref: CurrentUserRef | null) => void;
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  unreadChatCount: number;
  setUnreadChatCount: (count: number) => void;
}

const defaultUser: User = {
  id: null,
  username: null,
  chatIds: [],
  bio: null,
  avatarUrl: null,
  friends: [],
};

export const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => { return; },
  currentUserRef: null,
  setCurrentUserRef: () => { return; },
  notificationCount: 0,
  setNotificationCount: () => { return; },
  unreadChatCount: 0,
  setUnreadChatCount: () => { return; },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [currentUserRef, setCurrentUserRef] = useState<CurrentUserRef | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);

  return (
    <UserContext.Provider value={{ user, setUser, currentUserRef, setCurrentUserRef, notificationCount, setNotificationCount, unreadChatCount, setUnreadChatCount }}>
      {children}
    </UserContext.Provider>
  );
};
