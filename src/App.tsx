import './App.css';
// import { useState } from 'react';
// import { UserData } from './Interfaces'
import LoginForm from './Login';
import MenuBar from './components/layout/MenuBar';
import { useUserLoggedContext } from './context/UserLoggedContext';
import UserInformation from './components/pages/userInformation';
import UserRegistration from './components/UserRegistration';
import { Route, Routes, Navigate } from 'react-router-dom';
import Contacts from './components/contacts/Contacts';
import NewContact from './components/contacts/NewContact';
import Companies from './components/companies/Companies';
import NewCompany from './components/companies/NewCompany';
import CompanyShow from './components/companies/CompanyShow';
import ApplicationsGrid from './components/JobApplications/JobApplications';
import DashBoard from './components/dashboard/DashBoard';
function App() {
  const { isLoggedIn, userData } = useUserLoggedContext()
  return (
    <Routes>
      <Route // Public Route
        path="/"
        element={isLoggedIn ? <Navigate to="/home" replace /> : <LoginForm />}
      />

      {/* Protected layout using MenuBar */}
      <Route element={isLoggedIn ? <MenuBar /> : <Navigate to="/" replace />}>
        <Route
          path="/home"
          element={
            <DashBoard/>
          }
        />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/new" element={<NewCompany />} />
        <Route path="/companies/:id/contacts" element={<CompanyShow />} />
        <Route path="/contacts" element={<Contacts userData={userData}/>} />
        <Route path="/contacts/new" element={<NewContact userData={userData}/>} />
        <Route path="/job_applications" element={<ApplicationsGrid/>}/>
        <Route path="/job_applications/:jobAppId" element={<JobApplication/>}/>
        <Route
          path="/userInformation"
          element={<UserInformation userData={userData} />}
        />
        <Route path="/contacts/:contactId" element={<ShowContact />}/>
      </Route>
      <Route path="/UserRegistration" element={<UserRegistration/>}/>
    </Routes>
  );
}

export default App;
