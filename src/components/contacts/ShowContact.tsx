import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserLoggedContext } from "../../context/UserLoggedContext";

interface ContactData {
  id: string;
  type: string;
  attributes: {
    first_name: string;
    last_name: string;
    company_id: number;
    email: string;
    phone_number: string;
    notes: string;
    user_id: number;
    company: {
      id: number;
      name: string;
      website: string;
      street_address: string;
      city: string;
      state: string;
      zip_code: string;
      notes: string;
    };
  };
}

function ShowContact() {
  const { token, userData } = useUserLoggedContext();
  const { contactId } = useParams<{ contactId: string }>();
  const contactIdInt = contactId ? Number(contactId) : null;
  const [contact, setContact] = useState<ContactData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowContact = async () => {
      try {
        const userId = userData.user.data.id
        const response = await fetch(
          `http://localhost:3001/api/v1/users/${userId}/contacts/${contactId}`,
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
        const data = await response.json();
        console.log("Contact Data: ", data)
        setContact(data.data);
      } catch (error) {
        setFetchError(`${(error as Error).message}. Please try again later.`);
      }
    };

    if (contactIdInt) {
      fetchShowContact();
    }
  }, [contactId, token]);

  return (
    <section className="flex">
      {fetchError && <p className="error">{fetchError}</p>}
      {contact ? (
        <div>
          <h1>
            {contact.attributes.first_name} {contact.attributes.last_name}
          </h1>
          <h2>
            {contact.attributes.company.name}
          </h2>
          <h2>Other contacts at {contact.attributes.company.name}
            <ul>
              <li></li>
            </ul>
          </h2>
          <p>Email: {contact.attributes.email}</p>
          <p>Phone: {contact.attributes.phone_number}</p>
          <p>Notes: {contact.attributes.notes}</p>
        </div>
      ) : (
        <p>Loading contact...</p>
      )}
    </section>
  );
}
// Need full name, company, email, phone, notes, edit button, and "Other contacts at `${comnpany.name}`"
export default ShowContact;
//  jerseyMikesRox7