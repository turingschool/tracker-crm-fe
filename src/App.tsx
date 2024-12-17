// import turingLogo from './Turing-logo.png';
import './App.css';
import { useState } from 'react';
import { UserData } from './Interfaces'
import LoginForm from './Login';
// import { getUser } from './apiCalls';
import MenuBar from './components/layout/MenuBar';
import UserInformation from './components/pages/userInformation';
import { Route, Routes, Navigate } from "react-router-dom";
import Companies  from './components/companies/Companies';
import NewCompany from './components/companies/NewCompany';
import ApplicationsGrid from './components/JobApplications/JobApplications';


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
  const [isLoggedIn, setIsLoggedIn] = useState(false);   // temporary until the login is fixed

  // const handleLogin = async (id: number) => {
  //   try {
  //     const loginResponse = await getUser(id);
  //     if (loginResponse) {
  //       setUserData({
  //         token: loginResponse.data.token,
  //         user: {
  //           id: loginResponse.data.user.id,
  //           type: 'user',
  //           attributes: {
  //             email: loginResponse.data.user.attributes.email,
  //             name: loginResponse.data.user.attributes.name,
  //             companies: loginResponse.data.user.attributes.companies
  //           }
  //         }
  //       });
  //       setUserId(loginResponse.data.id);
  //       setIsLoggedIn(true);
  //       console.log(loginResponse);

  //     }
  //   } catch (err) {
  //     console.log(err);

  //     console.error('Error fetching logged in user:', err);
  //     setIsLoggedIn(false);
  //     console.log(err);

  //   }
  // };

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

  // const userLogOut = () => {
  //   setIsLoggedIn(false);
  //   setUserData({});
  // };

  console.log(userIsLoggedIn)
  return (
    // <div>
    //   <Routes>
    //     <Route 
    //       path="/"
    //       element={
    //         isLoggedIn ? (<Navigate to="/home" replace /> ):( <LoginForm onLogin={handleLogin} /> )
    //       }
    //     />
    //     <Route 
    //       path="/home"
    //       element={
    //         isLoggedIn ? (
    //           <div className='flex flex-row'>
    //             <MenuBar />
    //             <div>
    //               <h1>Welcome, {userData.username}</h1>
    //               <button onClick={handleLogout}>Log Out</button>
    //             </div>
    //           </div>
    //         ) : (
    //           <Navigate to="/" replace />
    //         )
    //       }
    //     /> 
    //     <Route path="/jobAppliations" element={<ApplicationsGrid/>}/>
    //     <Route path="/companies" element={<Companies/>} />
    //     <Route path="/companies/new" element={<NewCompany />} />
    //   </Routes>
    // </div>
    <Routes>
        {/* Public route */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <LoginForm onLogin={handleLogin} />
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
          {/* Home route with unchanged snippet */}
          <Route
            path="/home"
            element={
              <div>
                <h1>Welcome, {userData.username}</h1>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            }
          />
          <Route path="/job_applications" element={<ApplicationsGrid />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/new" element={<NewCompany />} />
        </Route>
      </Routes>
  );
}

export default App;
