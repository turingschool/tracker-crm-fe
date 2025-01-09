
const apiURL = process.env.REACT_APP_BACKEND_API_URL
const backendURL = `${apiURL}api/v1/`
/*-----------------------------------// GET //--------------------------------------*/


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

    const response = await fetch(`${backendURL}users/${userId}/job_applications`, {
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


/*-----------------------------------// POST - Register New User //--------------------------------------*/

interface UserData {
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
}

export const registerUser = async (userData: UserData): Promise<void> => {
  try {
    console.log(`backend ${backendURL}`)
    const response = await fetch(`${backendURL}users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('error', error);
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

/*-----------------------------------// DashBoard //--------------------------------------*/
export const fetchDashBoardData = async (userId: number, token: string | null) => {
  try {
    const response = await fetch(`${backendURL}users/${userId}/dashboard`, {
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

    return formattedData;

  } catch (error) {

    throw error;

  }

}