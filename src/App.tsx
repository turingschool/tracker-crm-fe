import { Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import LoginForm from './Login';
import { getUser } from './apiCalls';
import MenuBar from './components/layout/MenuBar'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserRegistration from './components/UserRegistration';
interface UserInfo {
  id: number,
  username: string,
  email: string
}


function App(): React.ReactElement {

  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState<Partial<UserInfo>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(true);   // temporary until the login is fixed

  const handleLogin = async (id: number) => {
    try {
      const loginResponse = await getUser(id);
      if (loginResponse) {
        setUserData({
          id: loginResponse.data.id,
          email: loginResponse.data.attributes.email,
          username: loginResponse.data.attributes.username,
        });
        setUserId(loginResponse.data.id);
        setIsLoggedIn(true);
        console.log(loginResponse);

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

  // ########################################################
  
  // WHERE I LEFT OFF
  // Working on Routes from Login link to User Registration Page
  
  // ########################################################


  console.log(`we need to have ${userId}... NOT`)
  return (
    <BrowserRouter>
      <Routes>
        {/* Index Route */}
        <Route
          path="/"
          element={
            <div>
              {!isLoggedIn && (
                <>
                  <h1>Please login</h1>
                  <LoginForm onLogin={handleLogin} />
                </>
              )}
              {isLoggedIn && (
                <div className="flex flex-row">
                  <MenuBar />
                  <h1>Welcome, {userData.username}</h1>
                  <button onClick={handleLogout}>Log Out</button>
                </div>
              )}
            </div>
          }
        />

        {/* Register User Route */}
        <Route
          path="/register"
          element={
            <div>
              <h1>Register User</h1>
              <UserRegistration />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
