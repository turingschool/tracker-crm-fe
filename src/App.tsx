import './App.css';
import { useState } from 'react';
import { UserData } from './Interfaces';
import LoginForm from './Login';
import MenuBar from './components/layout/MenuBar'
import { useUserLoggedContext } from './context/UserLoggedContext.tsx';
import UserInformation from './components/pages/userInformation';
import { Route, Routes, Navigate } from 'react-router-dom';
import Companies from './components/companies/Companies';
import NewCompany from './components/companies/NewCompany';

function App() {
  const { isLoggedIn, clearUserLogged } = useUserLoggedContext()
  const [userData, setUserData] = useState<UserData>({
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

  const handleLogout = () => {
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
              <h1>Welcome, {userData.user.data.attributes.name}</h1>
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