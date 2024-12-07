import { useState } from 'react';

function UserRegistration(): React.ReactElement {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage(null);

    if (password !== passwordConfirmation) {
      setErrorMessage("Passwords must match. Please try again.");
      return;
    }

    const userData = { name, email, password };
    
    try {
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to register");
        return;
      }

      console.log("User successfully registered");
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
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

          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <a href="/login">Click here to login</a>
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
