import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserLoggedContext } from "../../context/UserLoggedContext";
import { Link } from "react-router-dom";
import DeleteItem from "../common/DeleteItem";
import { deleteItem } from "../../trackerApiCalls";
import { Contact, ContactData } from "../../Interfaces"
import { fetchShowContact, fetchCompanyContact } from "../../apiCalls"
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

  const filteredOtherContacts = contact?.id
    ? otherContacts.filter(
        (otherContact) => contact?.id && otherContact.id !== contact.id
      )
    : [];
    return (
      <section className="flex">
        {fetchError && <p className="error">{fetchError}</p>}
        {contact ? (
          <>
            <div className="w-[76vh] pl-[6vw] mt-[8vh]">
              <h1
                data-testid="contact-name"
                className="text-[5.5vh] font-bold text-cyan-600 tracking-wide mb-[1vh]"
              >
                {contact.attributes.first_name} {contact.attributes.last_name}
              </h1>
    
              <h2
                data-testid="company-name"
                className="text-[3vh] font-bold text-cyan-700 hover:text-cyan-600 mb-[5vh]"
              >
                {contact.attributes.company ? (
                  <Link
                    data-testid="company-link"
                    to={`/companies/${contact.attributes.company_id}/contacts`}
                  >
                    {contact.attributes.company.name}
                  </Link>
                ) : (
                  "No Affiliated Companies"
                )}
              </h2>
    
              <div className="mt-[2.5vh] ml-0">
              <p className="text-black mb-[2vh] flex">
              <span data-testid="contact-email" className="font-bold w-[7vw]">Email</span>
              {contact.attributes.email ? (
                <a
                  className="text-cyan-600 hover:underline"
                  data-testid="email-address"
                  href={`mailto:${contact.attributes.email}`}
                >
                  {contact.attributes.email}
                </a>
              ) : (
                <span className="text-cyan-600 underline cursor-pointer">
                  Add Email
                </span>
              )}
            </p>

            <p className="mb-[5vh] flex">
              <span data-testid="contact-phone" className="font-bold w-[7vw]">Phone</span>
              {contact.attributes.phone_number ? (
                <span data-testid="phone-num">{contact.attributes.phone_number}</span>
              ) : (
                <span className="text-cyan-600 underline cursor-pointer">
                  Add Phone Number
                </span>
              )}
            </p>
          </div>
              <h3
                data-testid="notes"
                className="text-[2.5vh] font-bold text-cyan-700 mt-[2vh]"
              >
                Notes
              </h3>
              <p data-testid="note-text" className="mt-[2vh] whitespace-pre-wrap">
                {contact.attributes.notes}
              </p>
              <div className="mt-[20vh] flex flex-col items-center space-y-4 ml-[-16vw]">
                <button
                  className="border-2 border-cyan-600 text-cyan-600 px-6 py-2 rounded hover:bg-cyan-600 hover:text-white transition-all"
                  onClick={() => setIsEditOpen(true)}
                >
                  Edit
                </button>   
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
              <EditContactModal
                open={isEditOpen}
                setIsOpen={setIsEditOpen}
                contact={contact}
                userId={userId}
                token={token ?? ""} 
                onUpdate={handleUpdateContact}
              />
            </div>
            <div className="mt-[17vh]">
              <h2
                data-testid="other-contacts"
                className="text-[3vh] font-bold text-cyan-700 mb-[4vh]"
              >
                {contact.attributes.company
                  ? `Other contacts at ${contact.attributes.company.name}`
                  : "No Contacts"}
              </h2>
              <ul className="list-none">
                {filteredOtherContacts.map((otherContact) => (
                  <li key={otherContact.id} className="text-2xl font-medium text-cyan-700 mb-[2vh]">
                    <Link
                      className="text-cyan-600 hover:text-cyan-500 no-underline"
                      to={`/contacts/${otherContact.id}`}
                      >
                      {otherContact.attributes.first_name}{" "}
                      {otherContact.attributes.last_name}
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
