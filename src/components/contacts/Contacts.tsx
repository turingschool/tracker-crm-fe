import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserLoggedContext } from "../../context/UserLoggedContext";
import { ContactData, UserInformationProps } from "../../Interfaces";
import { fetchContacts } from '../../apiCalls';

function Contacts({ userData }: UserInformationProps) {
  const [contacts, setContacts] = useState<ContactData[] | []>([]);
  const [allContacts, setAllContacts] = useState<ContactData[] | []>([]);
  const [contactSearch, setContactSearch] = useState<string>("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { token } = useUserLoggedContext();

    useEffect(() => {
      const contactFetcher = async () =>{
        try {
          const allData = await fetchContacts(userData.user.data.id, token)

          setContacts(allData as ContactData[]);
          setAllContacts(allData as ContactData[]);
        } catch (error) {
          setFetchError(`${(error as Error).message}. Please try again later.`);
          console.error("Fetch error", error);
        }
        }
      contactFetcher();
    }, []);

  function searchContactList(event: React.ChangeEvent<HTMLInputElement>) {
    const search = event.target.value;
    setContactSearch(search);
    if (search === "") {
      setContacts(allContacts);
    } else {
      const filteredContacts = allContacts.filter((contact) => {
        const firstName = contact.attributes.first_name.toLowerCase();
        const lastName = contact.attributes.last_name.toLowerCase();
        const companyName =
          contact.attributes.company?.name?.toLowerCase() || "";

        return (
          firstName.includes(search) ||
          lastName.includes(search) ||
          companyName.includes(search)
        );
      });
      setContacts(filteredContacts);
    }
  }

  const searchBar = (
    <form onSubmit={(event) => event.preventDefault()}>
      <input
        className="p-[1vh] border-2 border-slate-800 rounded w-[200px] h-full"
        type="search"
        id="contacts-search"
        placeholder="Search Contacts..."
        value={contactSearch}
        onChange={searchContactList}
      />
    </form>
  );

  const contactData = contacts.map((data) => {
    const companyName = data.attributes.company?.name || "N/A";
    return (
      <tr key={data.id} className="even:bg-gray-50 hover:bg-gray-100">
        <Link to={`/contacts/${data.id}`}>
          <td className="p-4 border-b truncate max-w-[8vw]">
            {data.attributes.first_name} {data.attributes.last_name}
          </td>
        </Link>
        <td className="p-4 border-b truncate max-w-[8vw]">{companyName}</td>
        <td className="p-4 border-b truncate max-w-[8vw]">
          {data.attributes.notes}
        </td>
      </tr>
    );
  });

  return (
    <section className="flex">
      <div className="w-[70vw] pl-[4vw]">
        <h1 className="text-[5vh] font-bold text-cyan-600 my-[5vh]">
          Contacts
        </h1>
        <div className="flex justify-between items-center">
          {searchBar}
          <Link to="/contacts/new">
            <button className="bg-cyan-600 text-white p-[1vh] rounded w-[10vw]">
              Add New +
            </button>
          </Link>
        </div>
        {fetchError !== null ? (
          <p
            data-cy="failed-fetch-message"
            className="text-center font-bold text-red-600"
          >
            {fetchError}
          </p>
        ) : null}
        <table className="w-[70vw] mt-[1.5vh]">
          <thead className="border-t bg-gray-200">
            <tr>
              <th className="text-left p-4 border-b">Name</th>
              <th className="text-left p-4 border-b">Company</th>
              <th className="text-left p-4 border-b">Notes</th>
            </tr>
          </thead>
          <tbody>{contactData}</tbody>
        </table>
        {(contacts?.length || 0) === 0 ? (
          <p data-cy="no-contacts-message" className="text-center">
            No contacts saved. Click "Add New +" to start saving contacts.
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default Contacts;
