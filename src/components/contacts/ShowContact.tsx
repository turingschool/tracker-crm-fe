import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserLoggedContext } from '../../context/UserLoggedContext';
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
  };
}

function ShowContact() {
  const { token } = useUserLoggedContext();
  const { contactId } = useParams<{ contactId: string}>();
  const contactIdInt = contactId ? Number(contactId) : null;
  const [contact, setContact] = useState<ContactData | null>(null);

  // I need to create the process of fetching to the BE the #show user
  // 
  useEffect(() => {
    const fetchShowContact = async () => {
      try {
        const token =
          "";
        const response = await fetch("http://localhost:3001/api/v1/users/2/contacts")
      }
    }
  })

  return (
  <section className="flex">
  </section>
  );
};

export default ShowContact;
// eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJyb2xlcyI6W…wODB9.y-MWHeqNaCe2yelERjcq0nhjTN1_LOsWR-QB67oq8L0
