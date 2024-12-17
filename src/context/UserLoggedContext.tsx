import React, { createContext, useState, useContext } from 'react';

interface Value {
  token: string | null,
  roles: string[] | null,
  isLoggedIn: boolean,
  userLogged: Function,
  clearUserLogged: Function
}

const UserLoggedContext = createContext<null | Value>(null);

export function UserLoggedContextProvider({ children }: React.PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<null | string>(null);
  const [roles, setRoles] = useState<[] | string[]>([]);

  // Function to set the logged-in state
  const userLogged = (newToken: string, userRoles: string[]) => {
    setIsLoggedIn(true)
    setToken(newToken);
    setRoles(userRoles);
  };

  // Function to clear the logged-in state
  const clearUserLogged = () => {
    setToken(null);
    setRoles([]);
    setIsLoggedIn(false)
  };

  // Context value
  const value = {
    token,
    roles,
    isLoggedIn,
    userLogged,
    clearUserLogged,
  };

  return (
    <UserLoggedContext.Provider value={value}>
      {children}
    </UserLoggedContext.Provider>
  )
}

export const useUserLoggedContext = () => {
  const context = useContext(UserLoggedContext);
  if (!context) {
    throw new Error('useUserLogged must be used within a UserLoggedProvider');
  }
  return context;
}