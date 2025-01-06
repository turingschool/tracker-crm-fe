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
        const userId = userData.user.data.id;
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
        console.log("Contact Data: ", data);
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
    <section className="flex justify-between w-full">
      {fetchError && <p className="error">{fetchError}</p>}
      {contact ? (
        <>
          <div className="w-[65%] pl-[3vw] mt-[15vh]">
            <h1 className="text-[5vh] font-bold text-cyan-600 p-0">
              {contact.attributes.first_name} {contact.attributes.last_name}
            </h1>
            <h2 className="text-[3.5vh] font-bold text-cyan-500 p-0">
              {contact.attributes.company.name}
            </h2>
            <div className="m-5">
              <p>
                <span className="text=[1vh] font-bold">Email: </span>
                <span>{contact.attributes.email} </span>
              </p>
              <p>
                <span className="text=[1vh] font-bold">Phone: </span>
                <span>{contact.attributes.phone_number} </span>
              </p>
              <p>
                <span className="text=[1vh] font-bold">Notes: </span>
                <span>{contact.attributes.notes} </span>
              </p>
            </div>
          </div>
          <div className="w-[35%] text-left pr-[3vw] mt-[20vh]">
            <h2 className="text-[3vh] inset-3 font-bold text-cyan-500 mb-[2vh]">
              Other contacts at {contact.attributes.company.name}
            </h2>
            <ul className="list-disc list-inside font-normal">
              <li>Contact1</li>
              <li>Contact2</li>
            </ul>
          </div>
        </>
      ) : (
        <p>Loading contact...</p>
      )}
    </section>
  );
}
// Need full name, company, email, phone, notes, edit button, and "Other contacts at `${comnpany.name}`"
export default ShowContact;
//  jerseyMikesRox7
