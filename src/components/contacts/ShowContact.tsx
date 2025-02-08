import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserLoggedContext } from "../../context/UserLoggedContext";
import { Link } from "react-router-dom";
import { Contact, ContactData } from "../../Interfaces"

function ShowContact() {
  const { token, userData } = useUserLoggedContext();
  const { contactId } = useParams<{ contactId: string }>();
  const contactIdInt = contactId ? Number(contactId) : null;
  const [contact, setContact] = useState<ContactData | null>(null);
  const [otherContacts, setOtherContact] = useState<Contact[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {

    const fetchShowContact = async () => {

      try {
        const apiURL = process.env.REACT_APP_BACKEND_API_URL
        const backendURL = `${apiURL}api/v1/`
        const userId = userData.user.data.id;
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
        const data = await response.json();
        console.log("Contact Data: ", data);

        setContact(data.data);

        const companyId = data.data.attributes.company?.id;
        console.log("CompanyID: ", companyId);


        if(!companyId) {
          console.log("No company for this contact");
          setOtherContact([]);
          return
        }


        const companyContacts = await fetch(
          `${backendURL}users/${userId}/companies/${companyId}/contacts`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (companyContacts.status === 404) {
          setOtherContact([]);
          return;
        }
        if (!companyContacts.ok) {
          throw new Error(
            `Failed to fetch a companies contacts: ${companyContacts.statusText}`
          );
        }
        const companyContactsData = await companyContacts.json();
        console.log("Company Contacts Data: ", companyContactsData);

        const contactsList = companyContactsData.contacts.data;
        console.log("Contacts List:", contactsList);
        setOtherContact(contactsList);
      } catch (error) {
        setFetchError(`${(error as Error).message}. Please try again later.`);
      }
    };

    if (contactIdInt) {
      fetchShowContact();
    }
  }, [contactId, token]);

  const filteredOtherContacts = contact?.id ? otherContacts.filter(
    (otherContact) => contact?.id && otherContact.id !== contact.id)
    : [];
  return (
    <section className="flex justify-between w-full">
      {fetchError && <p className="error">{fetchError}</p>}
      {contact ? (
        <>
          <div className="w-[65%] pl-[3vw] mt-[1vh]">
            <h1
              data-testid="contact-name"
              className="text-[5vh] font-bold text-cyan-600 p-0"
            >
              {contact.attributes.first_name} {contact.attributes.last_name}
            </h1>
            <h2
              data-testid="company-name"
              className="text-[3.5vh] font-bold text-cyan-500 p-0"
            >
              {contact.attributes.company
                ? contact.attributes.company.name
                : "No Affiliated Companies" }
            </h2>
            <div className="m-5">
              <p>
                <span 
                  data-testid="contact-email"
                  className="text=[1vh] font-bold"
                >
                  Email:{" "}
                </span>
                <span data-testid="email-address">
                  {contact.attributes.email}
                </span>
              </p>
              <p>
                <span
                  data-testid="contact-phone"
                  className="text=[1vh] font-bold"
                >
                  Phone:{" "}
                </span>
                <span data-testid="phone-num">
                  {contact.attributes.phone_number}
                </span>
              </p>
            </div>
            <h2
              data-testid="notes"
              className="text=[4vh] font-bold text-cyan-500"
            >
              Notes:{" "}
            </h2>
            <p data-testid="note-text">{contact.attributes.notes}</p>
          </div>
          <div className="w-[35%] text-left pr-[3vw] mt-[2vh]">
            <h2
              data-testid="other-contacts"
              className="text-[3vh] inset-3 font-bold text-cyan-500 mb-[2vh]"
            >
              {contact.attributes.company 
              ? `Other contacts at ${contact.attributes.company.name}`
              : "No Contacts"}
              {/* Hi from the past! Here you can refactor to link to a new route... like create a new contact */}
            </h2>
            <ul className="list-disc list-inside">
              {filteredOtherContacts.map((otherContact) => (
                <li key={otherContact.id} className="font-normal">
                  <Link to={`/contacts/${otherContact.id}`}>
                    <td className="p-4 border-b truncate max-w-[8vw]">
                    {otherContact.attributes.first_name}{" "}
                    {otherContact.attributes.last_name}
                    </td>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>Loading contact...</p>
      )}
    </section>
  );
}
export default ShowContact;
