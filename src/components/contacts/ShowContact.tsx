import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserLoggedContext } from "../../context/UserLoggedContext";
import { Link } from "react-router-dom";
import DeleteItem from "../common/DeleteItem";
import { deleteItem } from "../../trackerApiCalls";
import { Contact, ContactData } from "../../Interfaces"
import { fetchShowContact, fetchCompanyContact, fetchUpdatedContact } from "../../apiCalls"
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
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [emailValue, setEmailValue] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
  const [phoneValue, setPhoneValue] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleUpdateContact = (updatedContact: ContactData) => {
    setContact(updatedContact);
  };

  const formatPhoneNumber = (value: string) => {
    let phoneInput = value.replace(/\D/g, "");
    if (phoneInput.length > 3 && phoneInput.length <= 6) {
      phoneInput = phoneInput.slice(0, 3) + "-" + phoneInput.slice(3);
    } else if (phoneInput.length > 6) {
      phoneInput =
        phoneInput.slice(0, 3) +
        "-" +
        phoneInput.slice(3, 6) +
        "-" +
        phoneInput.slice(6, 10);
    }
    return phoneInput;
  };

  const isPhoneValid = (phoneNumber: string) => {
    return phoneNumber === "" || /^\d{3}-\d{3}-\d{4}$/.test(phoneNumber);
  };

  const handlePhoneUpdate = async () => {
    if (!contact || !contactIdInt) return;

    if (!isPhoneValid(phoneValue)) {
      setPhoneError("Phone number must be in the format '555-555-5555'");
      return;
    }

    try {
      const updatedContactData = {
        ...contact.attributes,
        phone_number: phoneValue
      };

      const updatedContact = await fetchUpdatedContact(
        userId,
        contactIdInt,
        updatedContactData,
        token ?? ""
      );

      setContact(updatedContact);
      setIsEditingPhone(false);
      setPhoneError(null);
    } catch (error) {
      setPhoneError("Failed to update phone number. Please try again.");
      console.error("Error updating phone number:", error);
    }
  };

  const handlePhoneKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditingPhone(false);
      setPhoneValue(contact?.attributes.phone_number || "");
      setPhoneError(null);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);
    setPhoneValue(formattedValue);
  };

  const handleEmailUpdate = async () => {
    if (!contact || !contactIdInt) return;

    try {
      const updatedContactData = {
        ...contact.attributes,
        email: emailValue
      };

      const updatedContact = await fetchUpdatedContact(
        userId,
        contactIdInt,
        updatedContactData,
        token ?? ""
      );

      setContact(updatedContact);
      setIsEditingEmail(false);
      setEmailError(null);
    } catch (error) {
      setEmailError("Failed to update email. Please try again.");
      console.error("Error updating email:", error);
    }
  };

  const handleEmailKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
     if (e.key === 'Escape') {
      setIsEditingEmail(false);
      setEmailValue(contact?.attributes.email || "");
      setEmailError(null);
    }
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
                className="text-[2.5vh] font-bold text-cyan-700 hover:text-cyan-700"
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
              {isEditingEmail ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={emailValue}
                      onChange={(e) => setEmailValue(e.target.value)}
                      onKeyDown={handleEmailKeyPress}
                      onBlur={handleEmailUpdate}
                      className="border border-cyan-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      autoFocus
                    />
                    <button 
                      onClick={handleEmailUpdate}
                      className="text-cyan-600 hover:text-cyan-700 transition-colors"
                      aria-label="Save email"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </button>
                  </div>
                  {emailError && <span className="text-red-500 text-sm mt-1">{emailError}</span>}
                </div>
              ) : contact?.attributes.email ? (
                <a
                  data-testid="email-address"
                  className="text-cyan-600 hover:underline hover:text-cyan-500"
                  href={`mailto:${contact.attributes.email}`}
                >
                  {contact.attributes.email}
                </a>
              ) : (
                <span 
                  className="text-cyan-600 underline cursor-pointer"
                  onClick={() => {
                    setIsEditingEmail(true);
                    setEmailValue("");
                  }}
                >
                  Add Email
                </span>
              )}
            </p>

            <p className="text-black mb-[2vh] flex">
              <span data-testid="contact-phone" className="font-bold w-[7vw]">Phone</span>
              {isEditingPhone ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={phoneValue}
                      onChange={handlePhoneChange}
                      onKeyDown={handlePhoneKeyPress}
                      onBlur={handlePhoneUpdate}
                      placeholder="555-555-5555"
                      className="border border-cyan-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      autoFocus
                    />
                    <button 
                      onClick={handlePhoneUpdate}
                      className="text-cyan-600 hover:text-cyan-700 transition-colors"
                      aria-label="Save phone number"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </button>
                  </div>
                  {phoneError && <span className="text-red-500 text-sm mt-1">{phoneError}</span>}
                </div>
              ) : contact?.attributes.phone_number ? (
                <span data-testid="phone-num">{contact.attributes.phone_number}</span>
              ) : (
                <span 
                  className="text-cyan-600 underline cursor-pointer"
                  onClick={() => {
                    setIsEditingPhone(true);
                    setPhoneValue("");
                  }}
                >
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
