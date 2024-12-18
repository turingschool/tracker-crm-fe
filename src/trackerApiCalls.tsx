/*-----------------------------------// GET USER //--------------------------------------*/

export const getUser = async (userId: number) => {
  try {
    const apiURL = process.env.BACKEND_APP_API_URL
    const response = await fetch(`${apiURL}${userId}`, {
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

/*-----------------------------------// SHOW //--------------------------------------*/

export const showJobApp = async (userId: number, jobAppId: number, token: string) => {
  try {
    const response = await fetch(`http://localhost:3001/api/v1/users/${userId}/job_applications/${jobAppId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log(response);

      throw new Error(`Failed to fetch job application data: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    
    console.error('Error in showJobApp:', err);
    throw err;
  }
};

/*-----------------------------------// UPDATE USER//--------------------------------------*/
export const updateUser = async (userParams: Record<string, any> ) => {
  try {
    const apiURL = process.env.REACT_APP_BACKEND_API_URL;
    const response = await fetch(`${apiURL}api/v1/users/${userParams['id']}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userParams.token}`
      },
      body: JSON.stringify(userParams),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user data: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Error in updateUser:', err);
    throw err;
  }
};

/*-----------------------------------// LOGIN USER//--------------------------------------*/
export const loginUser = async (userParams: Record<string, any> ) => {
  try {
    const apiURL = process.env.REACT_APP_BACKEND_API_URL;
    const response = await fetch(`${apiURL}api/v1/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userParams),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return await response.json();
  } catch (err) {
    console.error('Error in loginUser:', err)
    throw err;
  }
};