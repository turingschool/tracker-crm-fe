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

/*-----------------------------------// UPDATE //--------------------------------------*/
export const updateUser = async (userId: number, userParams: Record<string, any> ) => {
  try {
    const response = await fetch(`http://localhost:3001/api/v1/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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