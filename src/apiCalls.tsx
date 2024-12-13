/*-----------------------------------// GET //--------------------------------------*/

const backendURL = 'http://localhost:3001/api/v1/'

export const getUser = async (userId: number) => {
  try {
    const response = await fetch(`${backendURL}users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log(response);

      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    
    console.error('Error in getUser:', err);
    throw err;
  }
};

interface UserData {
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
}

export const registerUser = async (userData: UserData): Promise<void> => {
  try {
    const response = await fetch(`${backendURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('Error: ', error)
      throw new Error(error.message);
    }

    console.log('User successfully registered');
    return await response.json();

  } catch (error) {
    console.error('Failed to register User:', error);
    throw error;
  }
};