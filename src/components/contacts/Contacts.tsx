import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserLoggedContext } from "../../context/UserLoggedContext";
import { UserData } from '../../Interfaces';

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

interface UserInformationProps {
  userData: UserData;
};

function Contacts( {userData}: UserInformationProps ) {
  const [contacts, setContacts] = useState<ContactData[] | []>([]);
  const [allContacts, setAllContacts] = useState<ContactData[] | []>([]);
  const [contactSearch, setContactSearch] = useState<string>("");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { token } = useUserLoggedContext();
  const userId = userData.user.data.id ? Number(userData.user.data.id) : undefined
 
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/users/${userId}/contacts`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch contacts: ${response.statusText}`);
        }
        const data = await response.json();
        setContacts(data.data as ContactData[]);
        setAllContacts(data.data as ContactData[]);
      } catch (error) {
        setFetchError(`${(error as Error).message}. Please try again later.`)
        console.error("Fetch error", error);
      }
    };
    fetchContacts();
  }, []);

  function searchContactList(event: React.ChangeEvent<HTMLInputElement>) {
    const search = event.target.value
    setContactSearch(search);
    if (search === "") {
      setContacts(allContacts)
    } else {
      const filteredContacts = allContacts.filter(contact => {
        const firstName = contact.attributes.first_name.toLowerCase();
        const lastName = contact.attributes.last_name.toLowerCase();
        const companyName = contact.attributes.company?.name?.toLowerCase() || "";

        return (
          firstName.includes(search) ||
          lastName.includes(search) ||
          companyName.includes(search)
          )
      })
      setContacts(filteredContacts)
    }   
  };

  const searchBar = (
    <form onSubmit={(event) => event.preventDefault()}>
      <input
        className='p-[1vh] border-2 border-slate-800 rounded w-[200px] h-full'
        type="search"
        id="contacts-search"
        placeholder='Search Contacts...'
        value={contactSearch}
        onChange={searchContactList}
      />
    </form>
  );

  const contactData = contacts.map(data => {
    const companyName = data.attributes.company?.name || "N/A";
    return (
      <tr key={data.id} className="even:bg-gray-50 hover:bg-gray-100">
        <td className="p-4 border-b truncate max-w-[8vw]">{data.attributes.first_name} {data.attributes.last_name}</td>
        <td className="p-4 border-b truncate max-w-[8vw]">
          {companyName}
        </td>
        <td className="p-4 border-b truncate max-w-[8vw]">{data.attributes.notes}</td>
      </tr>
    )
  });

  return (
    <section className='flex'>
      <div className='w-[70vw] pl-[4vw]'>
        <h1 className="text-[5vh] font-bold text-cyan-600 my-[5vh]">Contacts</h1>
        <div className='flex justify-between items-center'>
          {searchBar}
          <Link to='/contacts/new'>
            <button className='bg-cyan-600 text-white p-[1vh] rounded w-[10vw]'>Add New +</button>
          </Link>
        </div>
        {(fetchError !== null) ? <p data-cy="failed-fetch-message" className="text-center font-bold text-red-600">{fetchError}</p> : null}
        <table className='w-[70vw] mt-[1.5vh]'>
          <thead className="border-t bg-gray-200">
            <tr>
              <th className="text-left p-4 border-b">Name</th>
              <th className="text-left p-4 border-b">Company</th>
              <th className="text-left p-4 border-b">Notes</th>
            </tr>
          </thead>
          <tbody>
            {contactData}
          </tbody>
      </table>
        {(contacts?.length || 0) === 0 ? <p data-cy="no-contacts-message" className="text-center">No contacts saved. Click "Add New +" to start saving contacts.</p> : null}
      </div>
    </section>
  );
};

export default Contacts;