import { createContext, ReactNode, useState } from "react";

export interface User {
  id: string | null;
  username: string | null;
  chatIds: string[];
  bio: string | null;
}

export interface UserContextType {
  user: User;
  setUser: (user: User) => void;
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
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
