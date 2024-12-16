/*-----------------------------------// GET //--------------------------------------*/

export const getUser = async (userId: number, userToken: string) => {
  // console.log(userId, '---> HIT GET USER')
  try {
    const response = await fetch(`http://localhost:3001/api/v1/users/${userId}`, {
      method: 'GET',
      headers: {
        //  "Authorization" => "Bearer #{@token}"
        'Authorization': `bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log(response);

      throw new Error(`Failed to fetch user data: ${response.status}`);
    }
    // console.log(response.json(), '<--- HERE IN API')
    return await response.json();
  } catch (err) {
    
    console.error('Error in getUser:', err);
    throw err;
  }
};