import turingLogo from './Turing-logo.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({ onLogin }: { onLogin: (id: number) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const requestBody = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:3001/api/v1/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const responseData = await response.json();
      onLogin(responseData.data.id);
      setSuccessMessage('Login successful!');
      console.log('Response data:', responseData);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Error logging in: ${error.message}`);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <div className='login-form-wrap flex w-screen h-screen justify-center'>
      <div className='form-inputs w-6/12 flex'>
        <img className='turing-logo size-20' src={turingLogo} />
        <form onSubmit={handleSubmit} className='flex flex-col justify-evenly items-center w-[83%] px-11 py-72'>
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
          <button type="submit" className='login-btn w-[35%] h-[10%] rounded-sm bg-[#3cb6cc] font-[Helvetica Neue] font-sans text-base'>
            Login
          </button>
          <p className='no-account-message font-[Helvetica Neue] font-sans'>No Account? Click <Link to="/UserRegistration">Here</Link> To Register.</p>

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
          <h1 className='app-name font-sans font-[Helvetica Neue] text-7xl font-semibold tracking-wide text-slate-100'>Tracker</h1>
          <h2 className='app-author font-sans font-[Helvetica Neue] text-2xl font-bold leading-9 tracking-wide text-[#34a6bb]'><br />&nbsp; by Turing</h2>
        </div>
        <h3 className='app-tagline flex justify-center font-sans font-[Helvetica Neue] text-3xl font-extralight tracking-widest ml-5 text-slate-100'>Job hunting made easier.</h3>
      </div>
    </div>
  );
};

export default LoginForm;
