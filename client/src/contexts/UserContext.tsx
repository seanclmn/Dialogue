import { createContext, ReactNode, useState } from "react";
import { Chats_user$key } from "@generated/Chats_user.graphql";
import { NotificationsList_user$key } from "@generated/NotificationsList_user.graphql";

export interface User {
  id: string | null;
  username: string | null;
  chatIds: string[];
  bio: string | null;
}

export type CurrentUserRef = Chats_user$key | NotificationsList_user$key;

export interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  currentUserRef: CurrentUserRef | null;
  setCurrentUserRef: (ref: CurrentUserRef | null) => void;
}

const defaultUser = {
  id: null,
  username: null,
  chatIds: [],
  bio: null,
};

export const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {
    return;
  },
  currentUserRef: null,
  setCurrentUserRef: () => {
    return;
  },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [currentUserRef, setCurrentUserRef] = useState<CurrentUserRef | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser, currentUserRef, setCurrentUserRef }}>
      {children}
    </UserContext.Provider>
  );
};
