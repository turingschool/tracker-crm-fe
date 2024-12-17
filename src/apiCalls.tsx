/*-----------------------------------// GET //--------------------------------------*/

export const getUser = async (userId: number) => {
  try {
    const response = await fetch(`http://localhost:3001/api/v1/users/${userId}`, {
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

/*-----------------------------------// UPDATE //--------------------------------------*/
export const updateUser = async (userParams: Record<string, any> ) => {
  try {
    const response = await fetch(`http://localhost:3001/api/v1/users/${userParams['id']}`, {
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