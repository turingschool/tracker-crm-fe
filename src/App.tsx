import './App.css';
import LoginForm from './Login';
import MenuBar from './components/layout/MenuBar';
import { useUserLoggedContext } from './context/UserLoggedContext';
import UserInformation from './components/pages/userInformation';
import { Route, Routes, Navigate } from 'react-router-dom';
import Contacts from './components/contacts/Contacts';
import NewContact from './components/contacts/NewContact';
import Companies from './components/companies/Companies';
import NewCompany from './components/companies/NewCompany';
import ApplicationsGrid from './components/JobApplications/JobApplications';

function App() {
  const { isLoggedIn, clearUserLogged, userData } = useUserLoggedContext()
  return (
    <Routes>
      <Route // Public Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/home" replace />
          ) : (
            <LoginForm />
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
              <button onClick={() => clearUserLogged()}>Log Out</button>
            </div>
          }
        />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/new" element={<NewCompany />} />
        <Route path="/contacts" element={<Contacts userData={userData}/>} />
        <Route path="/contacts/new" element={<NewContact userData={userData}/>} />
        <Route path="/job_applications" element={<ApplicationsGrid/>}/>
        <Route
          path="/userInformation"
          element={<UserInformation userData={userData} />}
        />
      </Route>
    </Routes>
  );
}

export default App;