// import turingLogo from './Turing-logo.png';
import './App.css';
import { useState } from 'react';
import { UserData } from './Interfaces';
import LoginForm from './Login';
// import { getUser } from './apiCalls';
import MenuBar from './components/layout/MenuBar'
// import { BrowserRouter } from 'react-router-dom';
import { useUserLoggedContext } from './context/UserLoggedContext.tsx';
import UserInformation from './components/pages/userInformation';
import { Route, Routes, Navigate } from 'react-router-dom';
import Companies from './components/companies/Companies';
import NewCompany from './components/companies/NewCompany';

// interface UserInfo {
//   id: number,
//   username: string,
//   email: string,
//   token: number,
//   role: string[]
// }

function App() {
  const { isLoggedIn, clearUserLogged } = useUserLoggedContext()
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

  const handleLogout = () => {
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
    clearUserLogged()
  };

  return (
    <Routes>
      <Route // Public Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/home" replace />
          ) : (
            <LoginForm setData={setUserData} />
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