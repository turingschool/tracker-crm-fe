import React, { createContext, useState, useContext } from 'react';
import { UserData } from '../Interfaces';

interface Value {
  token: string | null,
  roles: string[] | null,
  isLoggedIn: boolean,
  userData: UserData,
  userLogged: Function,
  setUserData: Function,
  clearUserLogged: Function
}

const UserLoggedContext = createContext<null | Value>(null);

export function UserLoggedContextProvider({ children }: React.PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });
  const [token, setToken] = useState<null | string>(() => {
    return sessionStorage.getItem("token");
  });
  const [roles, setRoles] = useState<string[]>(() => {
    const storedRoles = sessionStorage.getItem("roles");
    return storedRoles ? JSON.parse(storedRoles) : [];
  });


  const [userData, setUserData] = useState<UserData>(() => {
    let userData = sessionStorage.getItem("userData")
    return userData ? JSON.parse(userData) : {    
      token: '',
      user: 
      {
        data: {
          id: 0,
          type: 'user',
          attributes: {
            name: '',
            email: '',
            companies: []
          }
        }
      }
    };
  });
  
  //Adjust this to session storage
  // const [userData, setUserData] = useState<UserData>({
  //   token: '',
  //   user: {
  //     data: {
  //       id: 0,
  //       type: 'user',
  //       attributes: {
  //         name: '',
  //         email: '',
  //         companies: []
  //       }
  //     }
  //   }
  // });

  // Function to set the logged-in state
  const userLogged = (newToken: string, userRoles: string[]) => {
    setIsLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", "true")
    setToken(newToken);
    sessionStorage.setItem("token", newToken)
    setRoles(userRoles);
    sessionStorage.setItem("roles", JSON.stringify(userRoles))
  };

  // Function to clear the logged-in state
  const clearUserLogged = () => {
    setIsLoggedIn(false)
    setToken(null);
    setRoles([]);
    setUserData({
      token: '',
      user: {
        data: {
          id: 0,
          type: 'user',
          attributes: {
            name: '',
            email: '',
            companies: []
          }
        }
      }
    });
  };

  // Context value
  const value = {
    token,
    roles,
    isLoggedIn,
    userData,
    userLogged,
    setUserData,
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