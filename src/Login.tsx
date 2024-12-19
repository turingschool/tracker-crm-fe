import { useNavigate } from 'react-router-dom';
import turingLogo from './Turing-logo.png';
import { useState } from 'react';
// import { LoginFormProps } from './Interfaces';
import { useUserLoggedContext } from './context/UserLoggedContext';
import { loginUser } from './trackerApiCalls'

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { userLogged, setUserData } = useUserLoggedContext()
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const requestBody = {
      email,
      password,
    };

    loginUser(requestBody)
      .then((loggedInUser) => {
        console.log("logged data:", loggedInUser)
        setUserData({
          token: loggedInUser.token,
          user: {
            data: {
              id: loggedInUser.user.data.id,
              type: 'user',
              attributes: {
                email: loggedInUser.user.data.attributes.email,
                name: loggedInUser.user.data.attributes.name,
                companies: loggedInUser.user.data.attributes.companies
              }
            }
          }
        });
        // setId(loggedInUser.user.data.id);
        // setLogin(true);
        setSuccessMessage('Login successful!');
        userLogged(loggedInUser.token, loggedInUser.user.data.type)
        navigate("/")
        console.log("User updated successfully:", loggedInUser);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        setErrorMessage(`Error in Login: ${error.message}`)
      });    
  };

  return (
    <div className='login-form-wrap flex w-screen h-screen justify-center'>
      <div className='form-inputs w-6/12 flex flex-col'>
        <form onSubmit={handleSubmit} className='flex flex-col justify-evenly items-center md:w-[24vw] mx-[6vw] md:mx-[12vw] my-[30vh]'>
        <img className='turing-logo -mt-[24vh] -ml-[30vw] mb-[24vh] size-20' src={turingLogo} />

          <h1 className='font-[Helvetica Neue] font-sans  text-xl'>Please login</h1>
          <div className='email-input flex flex-col justify-center w-[100%] mb-[10px]'>
            <label htmlFor="email" className='font-[Helvetica Neue] font-sans text-xl'>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-[100%] p-[8px] mt-[4px] border-4 rounded-md border-slate-600 bg-slate-200'
            />
          </div>
          <div className='password-input flex flex-col justify-center w-[100%] mb-[10px]'>
            <label htmlFor="password" className='font-[Helvetica Neue] font-sans text-xl'>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-[100%] p-[8px] mt-[4px] border-4 rounded-md border-slate-600 bg-slate-200'
            />
          </div>
          <button 
            type="submit" 
            className='login-btn w-[35%] min-h-10vh h-[10%] rounded-sm bg-[#3cb6cc] font-[Helvetica Neue] font-sans text-base'
            data-testid="login-button">
              Login
          </button>
          <p className='no-account-message font-[Helvetica Neue] font-sans'>No Account? Click <button className='font-[Helvetica Neue] font-sans text-cyan-700'>Here</button> To Register.</p>
        </form>
        {errorMessage && <p className='failed-login flex justify-center items-center rounded-md border-red-600 border-2 bg-slate-700 w-[50%] h-[5%] absolute top-[25%] left-[25%] font-[Helvetica Neue] font-sans font-semibold text-lg text-red-600'>{errorMessage}</p>}
        {successMessage && <p className='success-login flex justify-center items-center rounded-md border-green-600 border-2 bg-slate-700 w-[50%] h-[5%] absolute top-[25%] left-[25%] font-[Helvetica Neue] font-sans font-semibold text-lg text-green-600'>{successMessage}</p>}
      </div>
      <div className='quad-color-bar flex flex-col w-[1%] h-[100%]'>
        <div className='cyan-bar bg-cyan-500 w-[100%] h-[25%]'/>
        <div className='yellow-bar bg-yellow-500 w-[100%] h-[25%]'/>
        <div className='red-bar bg-red-500 w-[100%] h-[25%]'/>
        <div className='green-bar bg-green-500 w-[100%] h-[25%]'/>
      </div>
      <div className='title-wrap w-6/12 flex flex-col justify-center items-center bg-[#046576]'>
        <div className='app-name-and-author flex justify-center'>
          <h1 className='app-name font-sans font-[Helvetica Neue] text-2xl md:text-7xl  font-semibold tracking-wide text-slate-100'>Tracker</h1>
          <h2 className='app-author font-sans font-[Helvetica Neue] md:text-2xl font-bold leading-9 tracking-wide text-[#34a6bb]'><br />&nbsp; by Turing</h2>
        </div>
        <h3 className='app-tagline flex justify-center font-sans font-[Helvetica Neue] text-3xl font-extralight tracking-widest ml-5 text-slate-100'>Job hunting made easier.</h3>
      </div>
    </div>
  );
};

export default LoginForm;
