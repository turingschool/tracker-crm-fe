import { useState } from 'react';
import { UserData } from './Interfaces'
import { updateUser } from './apiCalls'

function UserInformation(bob: UserData) {
  interface DataCompile {
    id?: number;
    name?: string;
    email?: string;
    [key: string]: any;  
  }
  const [name, setName] = useState(bob.username);
  const [email, setEmail] = useState(bob.email);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const compileData: DataCompile = {
      id: bob.id,
      name: name,
      email: email,
    }
    if (password !== '' && password === password2) {
      compileData["password"] = password;
      compileData["password_confirmation"] = password2
    }
    updateUser(compileData)
      .then((updatedUser) => {
        console.log("User updated successfully:", updatedUser);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  }
  
  const handlePassword2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword2(value);
    comparePasswords(password, value);
  };

  const comparePasswords = (pass1: string, pass2: string) => {
    if (pass1 && pass2) {
      if (pass1 !== pass2) {
        setErrorMessage('Passwords do not match');
      } else {
        setErrorMessage(null);
      }
    }
  };
  
  return (
    <>
      <form onSubmit={submit} className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Name</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={event => setName(event.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="name-input"
          required
        />
        <h2 className="text-2xl font-bold mb-4">Email</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="email-input"
          required
        />
        <h2 className="text-2xl font-bold mb-4">Password</h2>
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="password-input"
        />
        <h2>Re-enter password</h2>
        <input
          type="text"
          placeholder="Name"
          value={password2}
          onChange={handlePassword2Change}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="password-confirmation-input"
        />
        <br />
        <button 
          type="submit" 
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          data-testid="submit-button"
        >EDIT INFO</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </>
  )
}
export default UserInformation