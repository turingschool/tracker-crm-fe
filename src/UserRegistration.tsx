import { useState } from 'react';

function UserRegistration(): React.ReactElement {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

  return (
    <div className="user-registration">
      <div className="form-container">
        <h2>Create Account</h2>
        <form>
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
            type="passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="passwordConfirmation">PasswordConfirmation</label>
            <input
            id="passwordConfirmation"
            type="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

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
  )
}

export default UserRegistration;