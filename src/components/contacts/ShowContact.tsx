import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserLoggedContext } from "../../context/UserLoggedContext";
import { Link } from "react-router-dom";
import DeleteItem from "../common/DeleteItem";
import { deleteItem } from "../../trackerApiCalls";
import { Contact, ContactData } from "../../Interfaces"
import { fetchShowContact, fetchCompanyContact } from "../../trackerApiCalls"
import EditContactModal from "./EditContactModal";

function ShowContact() {
  const { token, userData } = useUserLoggedContext();
  const { contactId } = useParams<{ contactId: string }>();
  const contactIdInt = contactId ? Number(contactId) : null;
  const [contact, setContact] = useState<ContactData | null>(null);
  const [otherContacts, setOtherContact] = useState<Contact[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = userData.user.data.id;
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false); 
  const handleUpdateContact = (updatedContact: ContactData) => {
    setContact(updatedContact);
  };

  useEffect(() => {
    const contactFetcher = async () => {
      try {
        const allData = await fetchShowContact(userId, token, contactId)

        const companyData = allData.data.attributes.company 
        
        const normalizedCompany = 
          companyData && companyData.data
          ? companyData.data.attributes 
          : companyData || null

        setContact({
          ...allData.data,
          attributes: {
            ...allData.data.attributes,
            company: normalizedCompany,
          }
        })
        
        const companyId = allData.data.attributes.company?.id;
        console.log("CompanyID: ", companyId);

        if(!companyId) {
          console.log("No company for this contact");
          setOtherContact([]);
          return;
        }

        try {
          const companyContacts = await fetchCompanyContact(userId, token, companyId)
          console.log("fetched company contacts: ", companyContacts)

        if (companyContacts.status === 404) {
          setOtherContact([]);
          return;
        }

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

  if (fetchError) {
    return <p 
    data-cytest="error"
    className="text-center mt-10 text-red-500">Error: {fetchError}</p>;
  }

  const filteredOtherContacts = contact?.id
    ? otherContacts.filter(
        (otherContact) => contact?.id && otherContact.id !== contact.id
      )
    : [];

  return (
    <main className="flex">
      {fetchError && <p className="error">{fetchError}</p>}
      {contact ? (
        <>
        <div className="w-[76vh] pl-[6vw] mt-[8vh]">
          <h1
            data-testid="contact-name"
            className="text-[5.5vh] font-bold text-cyan-600 tracking-wide "
          >
            {contact.attributes.first_name} {contact.attributes.last_name}
          </h1>
          <h2
            data-testid="company-name"
            className="mb-[5vh] text-[3vh] font-bold text-cyan-700 hover:text-cyan-500"
          >
            {contact.attributes.company ? (
              <Link
                data-testid="company-link"
                to={`/companies/${contact.attributes.company_id}/contacts`}
                className="hover:text-cyan-500"
              >
                {contact.attributes.company.name}
              </Link>
            ) : (
              "No Affiliated Companies"
            )}
          </h2>

          {/* Contact Details */} 
          <div className="space-y-4 my-[6vh] pr-[12vw]">
            <div className="flex flex-row">
              <span 
                data-testid="contact-email" 
                className="text-lg text-gray-700 font-semibold w-[7vw]"
              >
                Email
              </span>
              {contact.attributes.email ? (
                <a
                  data-testid="email-address"
                  className="text-cyan-600 hover:underline hover:text-cyan-500"
                  href={`mailto:${contact.attributes.email}`}
                >
                  {contact.attributes.email}
                </a>
              ) : (
                <span className="text-cyan-600 underline cursor-pointer">
                  Add Email
                </span>
              )}
            </div>
            <div className="flex flex-row">
              <span
                data-testid="contact-phone"
                className="text-lg text-gray-700 font-semibold w-[7vw]"
              >
                Phone
              </span>
              {contact.attributes.phone_number ? (
                <span 
                  data-testid="phone-num" 
                  className="text-gray-600"
                >
                  {contact.attributes.phone_number}
                </span>
              ) : (
                <span className="text-cyan-600 underline cursor-pointer">
                  Add Phone Number
                </span>
              )}
            </div>
          </div>
          <span
            data-testid="notes"
            className="text-[2.5vh] font-bold text-cyan-700 mt-[2vh]"
          >
            Notes
          </span>
          <p data-testid="note-text" className="text-gray-600 mt-[2vh] whitespace-pre-wrap">
            {contact.attributes.notes}
          </p>

          {/* Buttons */}
          <div className="mt-[10vh] flex flex-col items-center space-y-4 ml-[-16vw]">

            {/* Edit Button */}
            <button
              data-testid="edit-button"
              className="border-2 border-cyan-600 text-cyan-700 px-8 py-2 rounded hover:bg-cyan-600 hover:text-white transition-all"
              onClick={() => setIsEditOpen(true)}
            >
              Edit
            </button>
            
            {/* Delete Button */}
            {contact && (
              <DeleteItem
                userId={userId}
                itemId={contactId || ""}
                itemType="contact"
                deleteAction={deleteItem}
                token={token ?? ""}
                onDeleteSuccess={() => {
                  setContact(null); 
                  navigate("/contacts");
                }}
              />
            )}
          </div>

          {/* Edit Modal */}
          <EditContactModal
            open={isEditOpen}
            setIsOpen={setIsEditOpen}
            contact={contact}
            userId={userId}
            token={token ?? ""} 
            onUpdate={handleUpdateContact}
          />
        </div>

        {/* Contacts Section */}
        <div className="mt-[16vh] mr-[20vw]">
          <h4
            data-testid="other-contacts-header"
            className="text-[3vh] font-bold text-cyan-700 mb-[4vh] text-nowrap"
          >
            {contact.attributes.company
              ? `Other contacts at ${contact.attributes.company.name}`
              : "No Contacts"}
          </h4>
          <ul
            data-testid="other-contacts-list"
            className="list-none">
            {filteredOtherContacts.map((otherContact) => (
              <li 
              data-testid="contact-li"
              key={otherContact.id} 
              className="text-2xl font-medium text-cyan-700 mb-[2vh]">
                <Link
                  className="text-cyan-600 hover:text-cyan-500 no-underline"
                  to={`/contacts/${otherContact.id}`}
                  >
                  {otherContact.attributes.first_name} {otherContact.attributes.last_name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        </>
      ) : (
        <p>Loading contact...</p>
      )}
    </main>
  );
    
}
export default ShowContact;
