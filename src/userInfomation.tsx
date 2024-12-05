import { useState } from 'react';
import { UserInfo } from './Interfaces'
import { updateUser } from './apiCalls'

function UserInformation(userInfo:UserInfo) {
  interface DataCompile {
    id: number;
    name: string;
    email: string;
    [key: string]: any;  
  }
  const [name, setName] = useState(userInfo.username);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const compileData: DataCompile = {
      id: userInfo.id,
      name: name,
      email: email,
    }
    if (password !== '' && password === password2) {
      compileData["password"] = password;
      compileData["password_confirmation"] = password2
    }
    updateUser(userInfo.id, compileData)
      .then((updatedUser) => {
        console.log("User updated successfully:", updatedUser);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  }

  return (
    <>
      <form onSubmit={submit}>
        <h2>Name</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={event => setName(event.target.value)}
          required
        />
        <h2>Email</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          required
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