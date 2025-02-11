import { UserRegistrationData, FormInputData, NewContact, Company } from "./Interfaces"
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

  /*-----------------------------------// Index - Companies //--------------------------------------*/
export const fetchCompanies = async (userId: number | undefined, token: string | null) => {
  try {
    const apiURL = process.env.REACT_APP_BACKEND_API_URL
    const backendURL = `${apiURL}api/v1/`
    const response = await fetch(`${backendURL}users/${userId}/companies`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch companies");
    }

    const result = await response.json();
    const companyList = result.data.map((company: Company) => ({
      id: company.id,
      name: company.attributes.name,
    }));
    return companyList
  } catch (error: unknown) {
    if (error instanceof Error) {
    console.error("Error fetching companies:", error.message);
    throw error;
  } 
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
          throw new Error("Failed to add the contact.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error adding contact:", error.message);
          throw error; 
        } else {
          console.error("An unexpected error occurred:", error);
          throw new Error("An unexpected error occurred while adding the contact.");
        }
      }
    };

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
  } else {
    console.error("An unexpected error occurred:", error);
    throw new Error("An unexpected error occurred while retrieving the contact.");
  }
  }
}

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
      throw new Error(`Failed to fetch the company contacts: ${response.statusText}`);
    }
    const result = await response.json();  
    const contactsList = result.contacts.data;
    return contactsList
  } catch (error: unknown) {
    if (error instanceof Error) {
    console.error("Please try again later", error.message);
    throw error;
  } else {
    console.error("An unexpected error occurred:", error);
    throw new Error("An unexpected error occurred while retreiving the company contacts.");
  }
  }
}
