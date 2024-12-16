import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuBar from "../layout/MenuBar";

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
      "user_id": number
  }
};

function Contacts() {
  const [contacts, setContacts] = useState<ContactData[] | []>([])
  const [allContacts, setAllContacts] = useState<ContactData[] | []>([])
  const [contactSearch, setContactSearch] = useState<string>("")
  
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJleHAiOjE3MzQ0Njg1MjR9.P5tqsH3teuE_E8oPOM01SD_makjWlsuSUQ2unr5bmn0";
        const response = await fetch("http://localhost:3001/api/v1/users/4/contacts", {
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
        console.log(data.data);
        setContacts(data.data as ContactData[]);
        setAllContacts(data.data as ContactData[]);
      } catch (error) {
        console.error("Fetch error", error);
      }
    };
    fetchContacts();
  }, []);

  function searchContactList(event: React.ChangeEvent<HTMLInputElement>) {
  // function searchContactList(event: React.FormEvent<HTMLFormElement>) {
    const search = event.target.value
    setContactSearch(search);
    if (search === "") {
      setContacts(allContacts)
    } else {
      const filteredContacts = allContacts.filter(contact => {
        console.log(contact, "HERE")
        return contact.attributes.first_name.toLowerCase().includes(search.toLowerCase())
      })
      setContacts(filteredContacts)
    }   
  };

  const searchBar = (
    <form onSubmit={(event) => event.preventDefault()}>
      {/* <img className='search-icon' src={searchIcon} alt='search icon'/> */}
      <input
        className='p-[1vh] border-2 border-slate-800 rounded w-[200px] h-full'
        type="search"
        id="contacts-search"
        placeholder='Search Contacts...'
        value={contactSearch}
        onChange={searchContactList}
      />
    </form>
  )

  const contactData = contacts.map(data => {
    console.log(data, "DATA")
    return (

      // <tr key={data.id} className="bg-gray-50 hover:bg-gray-100">
     <tr key={data.id} className="even:bg-gray-50 hover:bg-gray-100">
        <td className="p-4 border-b">{data.attributes.first_name} {data.attributes.last_name}</td>
        <td className="p-4 border-b">Company Name</td>
        <td className="p-4 border-b">{data.attributes.notes}</td>
      </tr>
    )
  })


  return (
    <section className='flex'>
      <MenuBar/>
      <div className='w-[70vw] pl-[4vw]'>
        <h1 className="text-[5vh] font-bold text-cyan-600 my-[5vh]">Contacts</h1>
        <div className='flex justify-between items-center'>
          {/* <input
          onSubmit={(event) => event.preventDefault()}
          className='p-[1vh] border-2 border-slate-800 rounded w-[200px] h-full'
          // className='p-[1vh] border-2 border-slate-800 rounded w-[12vw] h-full'
          type='text'
          // value={}
          placeholder='Search contacts...'
          /> */}
          {searchBar}
          <Link to='/contacts/new'>
            <button className='bg-cyan-600 text-white p-[1vh] rounded w-[10vw]'>Add New +</button>
          </Link>
        </div>
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
        {/* {contacts.length === 0 ? noContacts : contactData} */}
      </div>
    </section>
  );
};

export default Contacts;