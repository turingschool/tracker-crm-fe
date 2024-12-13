// import turingLogo from './Turing-logo.png';
import './App.css';
import { useState } from 'react';
import LoginForm from './Login';
import { getUser } from './apiCalls';
import MenuBar from './components/layout/MenuBar'
import { Navigate, Route, Routes } from 'react-router-dom';
import NewContact from './components/newContact/NewContact';


interface UserInfo {
  id: number,
  username: string,
  email: string
}


function App() {

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


  console.log(`we need to have ${userId}... NOT`)
  return (
   <div>
      {/* <div>
        {!isLoggedIn && (
          <>
            {/* <h1>Please login</h1> */}
            <LoginForm onLogin={handleLogin} />
          </>
        )}
        {isLoggedIn && (
          <div className='flex flex-row'>
            <MenuBar />
            <h1>Welcome, {userData.username}</h1>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </div> */}
    
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
                </div>
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        /> 
        <Route 
          path="/newContact"
          element={<NewContact/>}
        />
      </Routes>
    </div>
    </div>
  
  );
}

export default App;