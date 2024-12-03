import './App.css';
import { useState } from 'react';
import LoginForm from './Login';
import { getUser } from './apiCalls';
import MenuBar from './components/layout/MenuBar.jsx';

function App() {

  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const handleLogin = async (id) => {
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
      }
    } catch (err) {
      console.error('Error fetching logged in user:', err);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    setUserId(null);
    setUserData({});
    setIsLoggedIn(false);
  };

  const userIsLoggedIn = () => {
    setIsLoggedIn(true);
  };

  const userLogOut = () => {
    setIsLoggedIn(false);
    setUserData({});
  };


  return (
    <div>
      {!isLoggedIn && (
        <div className='main-area'>
          <h1>Please login</h1>
          <LoginForm onLogin={handleLogin} />
        </div>
      )}
      {isLoggedIn && (
        <div className='container-div'>
          <MenuBar />
          <div className='main-area'>

            <h1>Welcome, {userData.username}</h1>
            <button onClick={handleLogout}>Log Out</button>
          </div></div>
      )}
    </div>
  );
}

export default App;