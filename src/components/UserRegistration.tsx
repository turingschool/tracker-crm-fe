import React from 'react';
import turingLogo from '../Turing-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { registerUser } from '../apiCalls';

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
      <div className="form-inputs w-6/12 flex">
        <img className='turing-logo size-20' src={turingLogo} />
        <h2>Create Account</h2>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="name" className='font-[Helvetica Neue] font-sans text-xl'>Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Add text"
            className='w-[100%] p-[8px] mt-[4px] border-4 rounded-md border-slate-600 bg-slate-200'
            />

          <label htmlFor="email" className='font-[Helvetica Neue] font-sans text-xl'>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Add text"
            className='w-[100%] p-[8px] mt-[4px] border-4 rounded-md border-slate-600 bg-slate-200'
            />

          <label htmlFor="password" className='font-[Helvetica Neue] font-sans text-xl'>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Add text"
            className='w-[100%] p-[8px] mt-[4px] border-4 rounded-md border-slate-600 bg-slate-200'
            />

          <label htmlFor="passwordConfirmation" className='font-[Helvetica Neue] font-sans text-xl'>Confirm Password</label>
          <input
            id="passwordConfirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            placeholder="Add text"
            className='w-[100%] p-[8px] mt-[4px] border-4 rounded-md border-slate-600 bg-slate-200'
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" >Register</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Click here to login</Link>
        </p>
      </div>
      <div className="text-container">
        <h1>Tracker</h1>
        <p>Job hunting made easier.</p>
      </div>
    </div>
  );
}

export default UserRegistration;