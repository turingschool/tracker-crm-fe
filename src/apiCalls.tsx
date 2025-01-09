/*-----------------------------------// GET //--------------------------------------*/

const backendURL = 'http://localhost:3001/api/v1/'

export const getUser = async (userId: number) => {
  console.log(userId, '---> HIT GET USER')
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
    console.log(response.json(), '<--- HERE IN API')
    return await response.json();
  } catch (err) {
    
    console.error('Error in getUser:', err);
    throw err;
  }
};

/*-----------------------------------// Index - Job Apps //--------------------------------------*/
export const fetchApplicationsData = async (userId: number, token: string) => {
  try {
    const response = await fetch(`http://localhost:3001/api/v1/users/${userId}/job_applications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch applications: ${response.statusText}`);
    }

    const result = await response.json();
    const formattedData = result.data.map((item: any) => ({
      id: item.id,
      ...item.attributes,
    }));

    return formattedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
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

/*-----------------------------------// DashBoard //--------------------------------------*/
export const fetchDashBoardData = async (userId: number, token: string) => {
  try {
    const response = await fetch(`http://localHost:3001/api/v1/users/${userId}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch applications: ${response.statusText}`);
    }

    const result = await response.json();

    const formattedData = result.data.attributes.dashboard.weekly_summary
    console.log("formattedData",formattedData)

    return formattedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
