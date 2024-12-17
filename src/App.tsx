// import turingLogo from './Turing-logo.png';
import './App.css';
import { useState, useEffect } from 'react';
import { UserData } from './Interfaces';
import LoginForm from './Login';
import MenuBar from './components/layout/MenuBar';
import UserInformation from './components/pages/userInformation';
import { Route, Routes, Navigate } from 'react-router-dom';
import Companies from './components/companies/Companies';
import NewCompany from './components/companies/NewCompany';

function App() {
  const [userId, setUserId] = useState<number | null>(null);
  const [userData, setUserData] = useState<UserData>({
    token: '',
    user: {
      id: 0,
      type: 'user',
      attributes: {
        name: '',
        email: '',
        companies: []
      }
    }
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setUserId(null);
    setUserData({
      token: '',
      user: {
        id: 0,
        type: 'user',
        attributes: {
          name: '',
          email: '',
          companies: []
        }
      }
    });
    setIsLoggedIn(false);
  };
  const userIsLoggedIn = () => {
    setIsLoggedIn(true);
    console.log(`Is this right? ${userData}`)
    console.log(`we need to have ${userId}... NOT`)
  };

  useEffect(() => {
    userIsLoggedIn();
  }, []);
  
  return (
      <Routes>
        {/* Public route */}
        <Route 
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <LoginForm setLogin={setIsLoggedIn} setData={setUserData} setId={setUserId} />
            )
          }
        />

        {/* Protected layout using MenuBar */}
        <Route
          element={
            isLoggedIn ? (
              <MenuBar />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route 
            path="/home"
            element={
              <div>
                <h1>Welcome, {userData.user.attributes.name}</h1>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            }
          />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/new" element={<NewCompany />} />
          <Route 
            path="/userInformation"
            element={<UserInformation userData={userData} />}
          />
        </Route>
      </Routes>
  );
}

export default App;



