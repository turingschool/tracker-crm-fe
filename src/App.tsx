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
import NewJobApplication from './components/JobApplications/NewJobApplication';
import CompanyShow from './components/companies/CompanyShow';
import ApplicationsGrid from './components/JobApplications/JobApplications';
import ShowContact from './components/contacts/ShowContact';
import JobApplication from './components/pages/showJobApplication';
import DashBoard from "./components/dashboard/dashboard";
import JobApplicationInterviewQuestions from './components/JobApplications/JobApplicationInterviewQuestions';


function App() {
  const { isLoggedIn,  userData } = useUserLoggedContext()
  return (
      <Routes>
        <Route // Public Route
          path="/"
          element={<ProtectedRoute/>}
        />

        {/* Protected layout using MenuBar */}
        <Route element={isLoggedIn ? <MenuBar /> : <Navigate to="/" replace />}>
          <Route
            path="/home"
            element={
              <DashBoard/>
            }
          />
          <Route path="/jobapplications/new" element={<NewJobApplication />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/new" element={<NewCompany />} />
          <Route path="/companies/:id/contacts" element={<CompanyShow />} />
          <Route path="/contacts" element={<Contacts userData={userData}/>} />
          <Route path="/contacts/new" element={<NewContact userData={userData}/>} />
          <Route path="/job_applications" element={<ApplicationsGrid/>}/>
          <Route path="/job_applications/:jobAppId" element={<JobApplication/>}/>
          <Route path="/job_applications/:jobAppId/interviewQuestions" element={<JobApplicationInterviewQuestions/>}/>
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

function ProtectedRoute() {
  const { isLoggedIn } = useUserLoggedContext();
  return isLoggedIn ? <Navigate to="/home" replace /> : <LoginForm />;
}

export default App;
