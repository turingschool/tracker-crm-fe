import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserLoggedContext } from '../../context/UserLoggedContext';

interface ContactData {
  "id": string,
  "type": string,
  "attributes": {
      "first_name": string,
      "last_name": string,
      "company_id": number,
      "email": string,
      "phone_number": string,
      "notes": string,
      "user_id": number,
      "company": {
        "id": number;
        "name": string;
        "website": string;
        "street_address": string;
        "city": string;
        "state": string;
        "zip_code": string;
        "notes": string;}
  }
};

function ShowContact() {
  const { token } = useUserLoggedContext();
  const { contactId } = useParams<{ contactId: string}>();
  const contactIdInt = contactId ? Number(contactId) : null;
  const [contact, setContact] = useState<ContactData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);


  // I need to create the process of fetching to the BE the #show user
  // 
  useEffect(() => {
    const fetchShowContact = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/users/2/contacts/${contactId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch contact: ${response.statusText}`);
        }
        const data = await response.json();
        setContact(data.data);
      } catch (error) {
        setFetchError(`${(error as Error).message}. Please try again later.`);
      }
    };
  
    if (contactId) {
      fetchShowContact();
    }
  }, [contactId, token]);

  return (
  <section className="flex">
  </section>
  );
};

export default ShowContact;
// eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJyb2xlcyI6W…wODB9.y-MWHeqNaCe2yelERjcq0nhjTN1_LOsWR-QB67oq8L0
