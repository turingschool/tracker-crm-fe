/*-----------------------------------// GET //--------------------------------------*/

export const getUser = async (userId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/v1/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Error in getUser:', err);
    throw err;
  }
};