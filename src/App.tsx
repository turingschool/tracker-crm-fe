import './App.css';
import LoginForm from './pages/Login/Login';
import MenuBar from './pages/Dashboard/components/MenuBar';
import { useUserLoggedContext } from './context/UserLoggedContext';
import UserInformation from './pages/Login/components/userInformation';
import UserRegistration from './pages/Login/components/UserRegistration';
import { Route, Routes, Navigate } from 'react-router-dom';
import Contacts from './pages/Contacts/Contacts';
import NewContact from './pages/Contacts/components/NewContact';
import ImportContacts from './pages/Contacts/components/ImportContacts';
import Companies from './pages/Companies/Companies';
import NewCompany from './pages/Companies/components/NewCompany';
import NewJobApplication from './pages/JobApplications/components/NewJobApplication';
import CompanyShow from './pages/Companies/components/CompanyShow';
import JobApplications from './pages/JobApplications/JobApplications';
import ShowContact from './pages/Contacts/components/ShowContact';
import JobApplication from './pages/JobApplications/components/showJobApplication';
import DashBoard from "./pages/Dashboard/dashboard";
import { ErrorProvider } from "./context/ErrorContext";
import JobApplicationInterviewQuestions from "./pages/JobApplications/components/JobApplicationInterviewQuestions"


function App() {
  const { isLoggedIn,  userData } = useUserLoggedContext()
  return (
    <ErrorProvider>
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
          <Route path="/contacts/import" element={<ImportContacts userData={userData}/>} />
          <Route path="/job_applications" element={<JobApplications/>}/>
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
    </ErrorProvider>
  );
}

function ProtectedRoute() {
  const { isLoggedIn } = useUserLoggedContext();
  return isLoggedIn ? <Navigate to="/home" replace /> : <LoginForm />;
}

export default App;
