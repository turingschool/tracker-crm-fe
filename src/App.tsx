// import turingLogo from './Turing-logo.png';
import './App.css';
import { useState } from 'react';
import LoginForm from './Login';
import { getUser } from './apiCalls';
import MenuBar from './components/layout/MenuBar';
import { Route, Routes, Navigate } from "react-router-dom";
import Companies  from './components/companies/Companies';
import NewCompany from './components/companies/NewCompany';
import { UserLoggedContextProvider } from './context/UserLoggedContext.tsx';
import TestComponent from './test component/TestComponent.tsx';

interface UserInfo {
  id: number,
  username: string,
  email: string,
  token: number,
  role: string[]
}

function App() {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState<Partial<UserInfo>>({});
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = async (id: number, userToken: string) => {
    try {
      const loginResponse = await getUser(id, userToken);
      // console.log(loginResponse, '<--- HERE IN APP')
      if (loginResponse) {
        setUserData({
          id: loginResponse.data.id,
          email: loginResponse.data.attributes.email,
          username: loginResponse.data.attributes.username,
        });
        setUserId(loginResponse.data.id);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.log(err);

      console.error('Error fetching logged in user:', err);
      setIsLoggedIn(false);
      console.log(err);

    }
  };

  const handleLogout = () => {
    setUserId(null);
    setUserData({});
    setIsLoggedIn(false);
  };

  // const userIsLoggedIn = () => {
  //   setIsLoggedIn(true);
  // };

  // const userLogOut = () => {
  //   setIsLoggedIn(false);
  //   setUserData({});
  // };


  console.log(`we need to have ${userId}... NOT`)
  return (
    <UserLoggedContextProvider>
      <div>
        <Routes>
          <Route 
            path="/"
            element={
              isLoggedIn ? (<Navigate to="/home" replace /> ):( <LoginForm onLogin={handleLogin} /> )
            }
          />
          <Route 
            path="/home"
            element={
              isLoggedIn ? (
                <div className='flex flex-row'>
                  <MenuBar />
                  <div>
                    <h1>Welcome, {userData.username}</h1>
                    <button onClick={handleLogout}>Log Out</button>
                    {/* <TestComponent testProps={[isLoggedIn, userData]} /> */}
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          /> 
          <Route path="/companies" element={<Companies/>} />
          <Route path="/companies/new" element={<NewCompany />} />
        </Routes>
      </div>
    </UserLoggedContextProvider>
  );
}

export default App;
