import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserLoggedContext } from "../../context/UserLoggedContext";
import { Link } from "react-router-dom";
import DeleteItem from "../common/DeleteItem";
import { deleteItem } from "../../trackerApiCalls";
import { Contact, ContactData } from "../../Interfaces"
import { fetchShowContact, fetchCompanyContact } from "../../apiCalls"

interface ContactAttributes {
  company: { name: string };
  first_name: string;
  last_name: string;
}

interface Contact {
  id: string;
  attributes: ContactAttributes;
}

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
  const [otherContacts, setOtherContact] = useState<Contact[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = userData?.user?.data?.id;

  useEffect(() => {
    const contactFetcher = async () => {
      try {
        const allData = await fetchShowContact(userId, token, contactId)
        setContact(allData.data)
        
        const companyId = allData.data.attributes.company?.id;
        console.log("CompanyID: ", companyId);

        if(!companyId) {
          console.log("No company for this contact");
          setOtherContact([]);
          return;
        }

  useEffect(() => {
    const contactFetcher = async () => {
      try {
        const allData = await fetchShowContact(userId, token, contactId)
        setContact(allData.data)
        
        const companyId = allData.data.attributes.company?.id;
        console.log("CompanyID: ", companyId);

        if(!companyId) {
          console.log("No company for this contact");
          setOtherContact([]);
          return;
        }

        try {
          const companyContacts = await fetchCompanyContact(userId, token, companyId)
          setOtherContact(companyContacts);
        } catch (error) {
          setFetchError(`${(error as Error).message}. Please try again later.`);
        }
      } catch (error) {
        setFetchError(`${(error as Error).message}. Please try again later.`);
      }
    }

    if (contactIdInt) {
      contactFetcher();
    }
  }, [contactId, token]);

  const filteredOtherContacts = contact?.id
    ? otherContacts.filter(
        (otherContact) => contact?.id && otherContact.id !== contact.id
      )
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
              className="text-[3.5vh] font-bold text-cyan-500 hover:text-cyan-700 p-0 hover:underline"
            >
              {contact.attributes.company
                ? 
                <Link data-testid="company-link" to={`/companies/${contact.attributes.company_id}/contacts`}>{contact.attributes.company.name}</Link>
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
                <a
                  className="text-cyan-500 underline hover:text-cyan-700"
                  data-testid="email-address"
                  href={`mailto:${contact.attributes.email}`}
                >
                  {contact.attributes.email}
                </a>
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
            <div className="mt-[80px] flex flex-col items-start ml-20">
              <DeleteItem
                userId={userId}
                itemId={contactId || ""}
                itemType="contact"
                deleteAction={deleteItem}
                token={token ?? ""}
                onDeleteSuccess={() => navigate("/contacts")}
              />
            </div>
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
                  <Link
                    className="text-cyan-500 underline hover:text-cyan-700"
                    to={`/contacts/${otherContact.id}`}
                  >
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
