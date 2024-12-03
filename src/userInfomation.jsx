import './userInformation.css';
import { useState } from 'react';

function UserInformation() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  return (
    <>
      <form onSubmit={submit}>
        <h2>Name</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={event => setName(event.target.value)}
        />
        <h2>Email</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
        <h2>Password</h2>
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <h2>Re-enter password</h2>
        <input
          type="text"
          placeholder="Name"
          value={password2}
          onChange={event => setPassword2(event.target.value)}
        />
        <br />
        <button type="submit">EDIT INFO</button>
      </form>
    </>
  )
}
export default UserInformation