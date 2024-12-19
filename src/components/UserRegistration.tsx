import React from 'react';
import turingLogo from '../Turing-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { registerUser } from '../apiCalls';
import FormField from './layout/FormField';

function UserRegistration(): React.ReactElement {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setErrorMessage("Passwords must match. Please try again.");
      return;
    }

    try {
      const newUser = await registerUser({ name, email, password, passwordConfirmation});  
      console.log('User registered successfully: ', newUser)

      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');

      setErrorMessage(null);

      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error registering user: ', error);
      setErrorMessage(error.message || "Registration failed. Please try again.")
    }
  };

  return (
    <div className="login-form-wrap flex w-screen h-screen justify-center">
      <div className="form-inputs w-6/12 flex flex-col items-center">
        <img className='absolute top-5 left-5 size-20' src={turingLogo} alt="Turing Logo"/>

        <form onSubmit={handleFormSubmit} >

          <h2 className="text-4xl text-gray-600 font-[Helvetica Neue] text-center mt-40 mb-10 tracking-wider">Create Account</h2>

          <div className="">
            <FormField formType={"text"} state={name} onChangeHandler={(e) => setName(e.target.value)} name={"Username"}  />
            <FormField formType={"text"} state={name} onChangeHandler={(e) => setName(e.target.value)} name={"Email"}  />
            <FormField formType={"text"} state={name} onChangeHandler={(e) => setName(e.target.value)} name={"Password"}  />
            <FormField formType={"text"} state={name} onChangeHandler={(e) => setName(e.target.value)} name={"Confirm Password"}  />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="mt-5 flex flex-col items-center justify-center">
            <button 
              type="submit" 
              className="flex justify-center items-center bg-cyan-800 text-white rounded h-12 w-40 p-[8px] mt-[4px] hover:bg-cyan-600 focus:ring-2 focus:ring-cyan-500"
              >
                Register
            </button>
              <p className="text-gray-500 text-xl font-extralight block mt-4 text-center">
                Already have an account? 
                <br/>
                <Link to="/login" className="hover:underline">Click here to login.</Link>
              </p>
          </div>
        </form>
      </div>

      <div className="quad-color-bar flex flex-col w-[1%] h-[100%]">
        <div className="cyan-bar bg-cyan-500 w-[100%] h-[25%]"/>
        <div className="yellow-bar bg-yellow-500 w-[100%] h-[25%]"/>
        <div className="red-bar bg-red-500 w-[100%] h-[25%]"/>
        <div className="green-bar bg-green-500 w-[100%] h-[25%]"/>
      </div>
      <div className="title-wrap w-6/12 flex flex-col justify-center items-center bg-cyan-800">
        <div className="app-name-and-author flex justify-center">
          <h1 className="app-name font-sans font-[Helvetica Neue] text-7xl font-semibold tracking-wide text-sky-200">Tracker</h1>
          <h2 className="app-author font-sans font-[Helvetica Neue] text-3xl font-bold leading-9 tracking-wide text-cyan-600"><br />&nbsp; by Turing</h2>
        </div>
        <h3 className="app-tagline flex justify-center font-sans font-[Helvetica Neue] text-3xl font-extralight tracking-widest text-sky-200">Job hunting made easier.</h3>
      </div>
      
    </div>
  );
}

export default UserRegistration;