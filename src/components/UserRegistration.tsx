import React, { useState } from 'react';
import turingLogo from '../Turing-logo.png';
import FormField from './layout/FormField';
import { Link, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader'; // Import the spinner
import { registerUser } from '../apiCalls';
import { loginUser } from '../trackerApiCalls';
import { useUserLoggedContext } from '../context/UserLoggedContext';
import TrackerBar from './layout/TrackerBar';

function UserRegistration(): React.ReactElement {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Fixed useState syntax
  const { userLogged, setUserData } = useUserLoggedContext();
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setErrorMessage("Passwords must match. Please try again.");
      return;
    }

    setIsLoading(true); // Start the spinner

    try {
      const newUser = await registerUser({ name, email, password, passwordConfirmation });
      console.log('User registered successfully: ', newUser);

      const requestBody = { email, password };

      const loggedInUser = await loginUser(requestBody);
      console.log('Logged in successfully: ', loggedInUser);

      setUserData({
        token: loggedInUser.token,
        user: {
          data: {
            id: loggedInUser.user.data.id,
            type: 'user',
            attributes: {
              email: loggedInUser.user.data.attributes.email,
              name: loggedInUser.user.data.attributes.name,
              companies: loggedInUser.user.data.attributes.companies,
            },
          },
        },
      });

      userLogged(loggedInUser.token, loggedInUser.user.data.type);
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
      setErrorMessage(null);
      navigate('/');
      console.log('loggedInUser', loggedInUser);
    } catch (error: any) {
      console.error('Error registering user: ', error);
      setErrorMessage(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-wrap flex w-screen h-screen justify-center">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <ClipLoader
            color={"#3498db"}
            loading={isLoading}
            size={60}
            aria-label="Loading UserRegistration"
          />
        </div>
      ) : (
        <>
          <div className="form-inputs w-6/12 flex flex-col items-center">
            <img className="turing-logo absolute top-5 left-5 size-20" src={turingLogo} alt="Turing Logo" />

            <form onSubmit={handleFormSubmit}>
              <h1 className="create-account text-4xl text-gray-600 font-[Helvetica Neue] text-center mt-40 mb-10 tracking-wider">
                Create Account
              </h1>

              <div>
                <FormField
                  formType="text"
                  state={name}
                  onChangeHandler={(e) => setName(e.target.value)}
                  name="Name"
                />
                <FormField
                  formType="email"
                  state={email}
                  onChangeHandler={(e) => setEmail(e.target.value)}
                  name="Email"
                />
                <FormField
                  formType="password"
                  state={password}
                  onChangeHandler={(e) => setPassword(e.target.value)}
                  name="Password"
                />
                <FormField
                  formType="password"
                  state={passwordConfirmation}
                  onChangeHandler={(e) => setPasswordConfirmation(e.target.value)}
                  name="Confirm Password"
                />
              </div>

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <div className="mt-5 flex flex-col items-center justify-center">
                <button
                  type="submit"
                  className="flex justify-center items-center bg-cyan-800 text-white rounded h-12 w-40 p-[8px] mt-[4px] hover:bg-cyan-600 focus:ring-2 focus:ring-cyan-500"
                  data-cy="register-button"
                >
                  Register
                </button>
                <p className="login-link text-gray-500 text-xl font-extralight block mt-4 text-center">
                  Already have an account?
                  <br />
                  <Link to="/" className="link-to-login hover:underline">
                  {/* Is this the correct endpoint for the login page? */}
                    Click here to login.
                  </Link>
                </p>
              </div>
            </form>
          </div>
					<TrackerBar />
        </>
      )}
    </div>
  );
}

export default UserRegistration;
