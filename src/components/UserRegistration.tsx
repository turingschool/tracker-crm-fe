import React from 'react';
import { Link } from 'react-router-dom';
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
      // Fires the registerUser function (POST) upon button click
      const newUser = await registerUser({ name, email, password, passwordConfirmation});  
      console.log('User registered successfully: ', newUser)

      // We want to clear the form upon successful registration.  Security concern.
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');

      setErrorMessage(null);

      // I want to navigate the user to their dashboard upon successful login.
      // Navigate('')
    } catch (error: any) {
      console.error('Error registering user: ', error);
      setErrorMessage(error.message || "Registration failed. Please try again.")
    }
  };

    // Shane wants to avoid using regular expressions at all costs for validations.
    // Will change if Erin requires it.

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
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="passwordConfirmation">Confirm Password</label>
          <input
            id="passwordConfirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* USE registerUser with button */}
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