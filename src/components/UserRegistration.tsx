import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { registerUser } from '../apiCalls';

function UserRegistration(): React.ReactElement {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

      const navigate = useNavigate();
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error registering user: ', error);
      setErrorMessage(error.message || "Registration failed. Please try again.")
    }
  };

  return (
    <div className="user-registration">
      <div className="form-container">
        <h2>Create Account</h2>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Add text"
            />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Add text"
            />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Add text"
            />

          <label htmlFor="passwordConfirmation">Confirm Password</label>
          <input
            id="passwordConfirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            placeholder="Add text"
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit">Register</button>
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