/*----------------------------------// FETCH Companies //--------------------------------*/
const apiURL = process.env.REACT_APP_BACKEND_API_URL;
const backendURL = `${apiURL}api/v1/`;

export const fetchCompanies = async (userId: number, token: string) => {
  try {
    const response = await fetch(`${backendURL}users/${userId}/companies`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch companies: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.error("Fetch error", error);
  }
};

/*-----------------------------------// CREATE A COMPANY //---------------------------------*/

export const createCompany = async (
  userId: number,
  token: string,
  newCompany: object
) => {
  try {
    const response = await fetch(`${backendURL}users/${userId}/companies`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCompany),
    });

    if (!response.ok) {
      throw new Error("Failed to add the company");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding company:", error);
    throw error;
  }
};

/*-----------------------------------// GET ONE COMPANY //-------------------------------*/

export const getACompany = async (
  userId: number,
  token: string,
  companyId: number
) => {
  try {
    const response = await fetch(
      `${backendURL}users/${userId}/companies/${companyId}/contacts`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch company: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the fetched data
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Propagate the error for the caller to handle
  }
};

/*---------------------------------// EDIT A COMPANY //----------------------------------*/

export const updateCompany = async (userId: number, token: string, companyId: number, updatedCompanyData: any) => {
  try {
    const response = await fetch(
      `${backendURL}users/${userId}/companies/${companyId}`,
      {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCompanyData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update company: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
};
  
/*-----------------------------------// GET USER //--------------------------------------*/

export const getUser = async (userId: number) => {
  try {
    const apiURL = process.env.REACT_APP_BACKEND_API_URL;
    const response = await fetch(`${apiURL}${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log(response);

      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error in getUser:", err);
    throw err;
  }
};

/*-----------------------------------// SHOW //--------------------------------------*/

export const showJobApp = async (
  userId: number,
  jobAppId: number,
  token: string | null
) => {
  try {
    const apiURL = process.env.REACT_APP_BACKEND_API_URL;
    const response = await fetch(
      `${apiURL}api/v1/users/${userId}/job_applications/${jobAppId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log(response);

      throw new Error(
        `Failed to fetch job application data: ${response.status}`
      );
    }

    return await response.json();
  } catch (err) {
    console.error("Error in showJobApp:", err);
    throw err;
  }
};

/*-----------------------------------// UPDATE USER//--------------------------------------*/
export const updateUser = async (userParams: Record<string, any>) => {
  try {
    const apiURL = process.env.REACT_APP_BACKEND_API_URL;
    const response = await fetch(`${apiURL}api/v1/users/${userParams["id"]}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userParams.token}`,
      },
      body: JSON.stringify(userParams),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user data: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error in updateUser:", err);
    throw err;
  }
};

/*-----------------------------------// LOGIN USER//--------------------------------------*/
export const loginUser = async (userParams: Record<string, any>) => {
  try {
    const apiURL = process.env.REACT_APP_BACKEND_API_URL;
    const response = await fetch(`${apiURL}api/v1/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userParams),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return await response.json();
  } catch (err) {
    console.error("Error in loginUser:", err);
    throw err;
  }
};

/*-----------------------------------// UPDATE JOB APPLICATION//--------------------------------------*/
export const updateJobApplication = async (userParams: Record<string, any>) => {
  try {
    const apiURL = process.env.REACT_APP_BACKEND_API_URL;
    const response = await fetch(
      `${apiURL}/api/v1/users/${userParams.userId}/job_applications/${userParams.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userParams.token}`,
        },
        body: JSON.stringify(userParams),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update user data: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error in updateUser:", err);
    throw err;
  }
};

/*-----------------------------------// DELETE Item //--------------------------------------*/
export const deleteItem = async (
  userId: number,
  itemType: string,
  itemId: string | number,
  token: string
) => {
  const resource = itemType === "company" ? "companies" : `${itemType}s`
  try {
    const response = await fetch(
      `${backendURL}users/${userId}/${resource}/${itemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {

      throw new Error(`Failed to delete ${itemType}: ${response.status}`);

    }

    return true;
  } catch (error) {
    console.error(`Error deleting ${itemType}:`, error);
    return false;
  }
};

