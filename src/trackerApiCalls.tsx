import { UserRegistrationData, FormInputData, NewContact } from "./Interfaces"
import { handleErrorResponse } from "./context/ErrorHelpers";
import { Company, CompanyData, APIResult, ChatGPTQuestion } from "./Interfaces";

const apiURL = process.env.REACT_APP_BACKEND_API_URL;
const backendURL = `${apiURL}api/v1/`;



/*----------------------------------// FETCH Companies //--------------------------------*/
type FetchCompaniesOptions = {
  userId: number;
  token: string;
};

const fetchCompaniesBase = async ({ userId, token }: FetchCompaniesOptions): Promise<any> => {
  const apiURL = process.env.REACT_APP_BACKEND_API_URL || "";
  const backendURL = `${apiURL}api/v1/`;

  const response = await fetch(`${backendURL}users/${userId}/companies`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch companies: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};
export const fetchCompanies = async (
  userId: number,
  token: string,
  setErrors: (messages: string[]) => void
): Promise<APIResult<Company[]>> => {
  try {
    const data = await fetchCompaniesBase({ userId, token });
    return { data };
  } catch (error: unknown) {
    if (error instanceof Error) {
    if (error.message.includes("Failed to fetch")) {
      setErrors(["Unable to connect to the server. Please try again later."]);
      return { error: "Unable to connect to the server. Please try again later." };
    }
    setErrors([error.message]);
    return { error: error.message };
  }
    setErrors(['An unexpected error occurred']);
    return { error: "An unexpected error occurred." };
  }
};

export const fetchCompaniesMapped = async (
  userId: number,
  token: string | null
): Promise<{ id: number; name: string }[]> => {
  if (!userId || !token) throw new Error("Missing userId or token");

  const data = await fetchCompaniesBase({ userId, token });

  return data.map((company: any) => ({
    id: company.id,
    name: company.attributes.name,
  }));
};

/*-----------------------------------// CREATE A COMPANY //---------------------------------*/
//Refactored to handle error messages through the back end.

export const createCompany = async (
  userId: number,
  token: string,
  newCompany: object,
  setErrors: (messages: string[]) => void
): Promise<APIResult<any>> => {
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
      await handleErrorResponse(response, setErrors);
      return { error: `Failed to add the company` };
    }
    const data = await response.json();
    return { data };
  } catch (error: any) {
    console.error("Error adding company:", error);
    setErrors(["Unable to connect to the server. Please try again later."]);
    return { error: error.message };
  }
};

/*-----------------------------------// GET ONE COMPANY //-------------------------------*/
//Refactored to handle error messages through the back end.

export const getACompany = async (
  userId: number,
  token: string,
  companyId: number,
  setErrors: (messages: string[]) => void
): Promise<APIResult<CompanyData>> => {
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
      await handleErrorResponse(response, setErrors);
      return { error: `Failed to fetch company: ${response.statusText}` };
    }

    const data = await response.json();
    return { data };
  } catch (error: any) {
    console.error("Fetch error:", error);
    setErrors(["Unable to connect to the server. Please try again later."]);
    return { error: error.message };
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
      const errorData = await response.json();
      console.log("handleErrorResponse called with:", errorData.message);
      return { error: errorData.message || "Failed to add the company" };
    }
    const data = await response.json();
    return { data };
  } catch (error: any) {
    return { error: error.message || "Unable to connect to the server. Please try again later." };
  }
};

/*-----------------------------------// SHOW JOB APPLICATIONS //--------------------------------------*/

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

/*-----------------------------------// POST NEW JOB APPLICATION//--------------------------------------*/
export const postJobApplication = async (userParams: Record<string, any>) => {
  try {
    const apiURL = process.env.REACT_APP_BACKEND_API_URL;
    const response = await fetch(
      `${apiURL}/api/v1/users/${userParams.userId}/job_applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userParams.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userParams)
    })

    if (!response.ok) {
      throw new Error('Failed to add job application');
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding job application:", error)
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

export const registerUser = async (userData: UserRegistrationData): Promise<void> => {
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

/*-----------------------------------// Index - Contacts //--------------------------------------*/

export const fetchContacts = async (userId: number, token: string | null) => {
  try {
    const apiURL = process.env.REACT_APP_BACKEND_API_URL
    const backendURL = `${apiURL}api/v1/`
    const response = await fetch(`${backendURL}users/${userId}/contacts`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch contacts: ${response.statusText}`);
    }
    const result = await response.json();
    const formattedData = result.data 
    return formattedData;
  } catch (error) {
    throw error;
  }
}

  /*-----------------------------------// Post- Contact //--------------------------------------*/
  export const fetchNewContact = async (userId: number | undefined, token: string | null, formInputData: FormInputData, newContact: NewContact) => {
    try {
      let url = `${backendURL}users/${userId}/contacts`;
        if (formInputData.companyId) {
          url = `${backendURL}users/${userId}/companies/${formInputData.companyId}/contacts`;
        }
        const response = await fetch(url, {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newContact),
        });

    if (!response.ok) {
      const errorData = await response.json();
        console.log('response', errorData)
      throw new Error(errorData.message || "Failed to add the contact");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding contact:", error.message);
      throw (error);
    }
  }
}

  /*-----------------------------------// Show - Contact //--------------------------------------*/
export const fetchShowContact = async (userId: number | undefined, token: string | null, contactId: string | undefined) => {
  try {
    const response = await fetch(
      `${backendURL}users/${userId}/contacts/${contactId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch contact: ${response.statusText}`);
    }
    const result = await response.json();
    return result
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching contact:", error.message);
      throw error;
    }
  }
}

  /*-----------------------------------// Update - Contact //--------------------------------------*/
  export const fetchUpdatedContact = async (
    userId: number,
    contactId: number,
    updatedContactData: any,
    token: string
  ) => {
    const response = await fetch(
      `${backendURL}users/${userId}/contacts/${contactId}`, 
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contact: updatedContactData }),
      }
    );
  
    if (!response.ok) {
      throw new Error(`Failed to update contact. Status: ${response.status}`);
    }
  
    const result = await response.json();
    return result.data; 
  };

  /*-----------------------------------//  Company Contacts //--------------------------------------*/
export const fetchCompanyContact = async (userId: number | undefined, token: string | null, companyId: string) => {
  try {
    const response = await fetch(
      `${backendURL}users/${userId}/companies/${companyId}/contacts`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch a company's contacts: ${response.statusText}`
      );
    }
    const result = await response.json();  
    const contactsList = result.contacts.data;
    return contactsList
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Please try again later", error.message);
      throw error;
    }
  }
}

/*-----------------------------------// GET INTERVIEW QUESTIONS //--------------------------------------*/
export const fetchInterviewQuestions = async (
    userId: number,
    jobApplicationId: number,
    token: string 
  ): Promise<APIResult<ChatGPTQuestion[]>> => {
  try {
    const response = await fetch(
      `${backendURL}users/${userId}/job_applications/${jobApplicationId}/interview_questions/fetch_or_create`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { error: `Failed to fetch interview questions: ${response.statusText}` };
    }

    const data = await response.json();
    return { data: data.data }
  } catch (error: any) {
    console.error('Error fetching interview questions:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
};