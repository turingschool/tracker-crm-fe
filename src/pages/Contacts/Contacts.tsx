import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserLoggedContext } from "../../context/UserLoggedContext";
import { useLocation } from "react-router-dom";

import { ContactData, UserInformationProps } from "../../constants/Interfaces";
import { fetchContacts } from '../../constants/trackerApiCalls';


function Contacts({ userData }: UserInformationProps) {
  const [contacts, setContacts] = useState<ContactData[] | []>([]);
  const [allContacts, setAllContacts] = useState<ContactData[] | []>([]);
  const [contactSearch, setContactSearch] = useState<string>("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { token } = useUserLoggedContext();
  const navigate = useNavigate();

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
        className="py-2 px-4 rounded w-[22vw] min-w-min border-2 border-slate-800"
        type="search"
        id="contacts-search"
        placeholder="🔍 Search Contacts"
        value={contactSearch}
        onChange={searchContactList}
      />
    </form>
  );

  const contactData = contacts.map((data) => {
    const companyName = data.attributes.company?.name || "N/A";
    return (
      <tr 
        key={data.id} 
        className="border-b hover:bg-gray-100 cursor-pointer"
        onClick={() => navigate(`/contacts/${data.id}`)}
      >
        <td className="p-4 text-gray-700">
          {data.attributes.first_name} {data.attributes.last_name}
        </td>
        <td className="p-4 truncate max-w-[8vw]">{companyName}</td>
        <td className="p-4 truncate max-w-[8vw]">
          {data.attributes.notes}
        </td>
      </tr>
    );
  });

  interface LocationState {
  importSuccess?: boolean;
}

const location = useLocation();
const state = (location.state || {}) as LocationState;
const importSuccess = state.importSuccess !== undefined

const showImportResult = "importSuccess" in state;


  return (
    <>
    {showImportResult && (
      <div
        className={`p-4 mb-6 rounded ${
          importSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {importSuccess
          ? "Contacts successfully imported!"
          : "Contact import failed. Please try again."}
      </div>
    )}

    <section className="flex">
      <div className="w-[76vw] pl-[6vw]">
        <h1 className="text-[5.5vh] font-bold text-cyan-600 tracking-wide mb-[2vh] mt-[8vh] ">
          Contacts
        </h1>
        <div className="flex justify-between items-center">
          <div>{searchBar}</div>
          <Link to="/contacts/new">
            <button className="bg-cyan-600 hover:bg-cyan-500 text-white tracking-wide py-2 px-4 rounded max-w-max">
              Add New +
            </button>
          </Link>
          <Link to="/contacts/import">
            <button className="bg-green-600 hover:bg-cyan-500 text-white tracking-wide py-2 px-4 rounded max-w-max">
              Import Contacts
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
          <thead className="border-t">
            <tr>
              <th className="text-left text-gray-700 p-4 border-b">Name</th>
              <th className="text-left text-gray-700 p-4 border-b">Company</th>
              <th className="text-left text-gray-700 p-4 border-b">Notes</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {contactData}
          </tbody>
        </table>
        {(contacts?.length || 0) === 0 ? (
          <p data-cy="no-contacts-message" className="text-center">
            No contacts saved. Click "Add New +" to start saving contacts.
          </p>
        ) : null}
      </div>
    </section>
    </>
  );
}

export default Contacts;
