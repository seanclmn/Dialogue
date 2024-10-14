import React, { createContext, ReactNode, useState } from 'react'
import { useCookies } from 'react-cookie';

interface UserContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  accessToken: string | undefined;
  login: (token: string, user: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);

  const accessToken = cookies.accessToken;

  const login = (token: string, user: string) => {
    setCookie('accessToken', token);
    setUser(user);
  };

  const logout = () => {
    removeCookie('accessToken');
    setUser(null);
  };

  console.log(user)

  return (
    <UserContext.Provider value={{ user, setUser, accessToken, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};