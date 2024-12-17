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

interface CompanyAttributes {
  id: number;
  name: string;
  website: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  notes: string;
}

interface Company {
  id: number;
  type: string;
  attributes: CompanyAttributes;
}

function Contacts() {
  const [contacts, setContacts] = useState<ContactData[] | []>([]);
  const [allContacts, setAllContacts] = useState<ContactData[] | []>([]);
  const [contactSearch, setContactSearch] = useState<string>("");
  const [companies, setCompanies] = useState<Company[] | null>([]); 
  
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJleHAiOjE3MzQ1NjA3ODN9.xJdO2fr_icpw5LqE9o3Oog8PJ6eyjiHE2qxx3y8wSfg";
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

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJleHAiOjE3MzQ1NjA3ODN9.xJdO2fr_icpw5LqE9o3Oog8PJ6eyjiHE2qxx3y8wSfg";
        const response = await fetch("http://localhost:3001/api/v1/users/2/companies", {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        console.log(response)

        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data.data);
        setCompanies(data.data as Company[]);
      } catch (error) {
        console.error("Fetch error", error);
      }
    };
    fetchCompanies();
  }, []);

  function searchContactList(event: React.ChangeEvent<HTMLInputElement>) {
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

  // const contactData = contacts.map(data => {
  //   let contactCompanyName = "N/A";
  //   if (data.attributes.company_id && companies) {
  //     contactCompany = companies.find(company => {
  //       console.log(company, "HERE")
  //       return company.id === data.attributes.company_id
  //     })
  //     // contactCompany = companies.find(
  //     //   company => company.id === data.attributes.company_id
  //     // )?.name
  //   } else {
  //     contactCompany = "N/A";
  //   }
  //   return (
  //    <tr key={data.id} className="even:bg-gray-50 hover:bg-gray-100">
  //     <td className="p-4 border-b">{data.attributes.first_name} {data.attributes.last_name}</td>
  //     <td className="p-4 border-b">
  //       {contactCompany.attributes.name}
  //     </td>
  //     <td className="p-4 border-b">{data.attributes.notes}</td>
  //   </tr>
  //   )
  // });
  const contactData = contacts.map(data => {
    // Default to "N/A" if no company is found
    let contactCompanyName = "N/A";
  
    // Find the company if company_id exists and companies array is not null
    if (data.attributes.company_id && companies) {
      const foundCompany = companies.find(
        company => company.id === data.attributes.company_id
      );
      if (foundCompany) {
        contactCompanyName = foundCompany.attributes.name;
      }
    }
  
    return (
      <tr key={data.id} className="even:bg-gray-50 hover:bg-gray-100">
        <td className="p-4 border-b">
          {data.attributes.first_name} {data.attributes.last_name}
        </td>
        <td className="p-4 border-b">
          {contactCompanyName} {/* Safely display the company name or "N/A" */}
        </td>
        <td className="p-4 border-b">{data.attributes.notes}</td>
      </tr>
    );
  });

  return (
    <section className='flex'>
      <MenuBar/>
      <div className='w-[70vw] pl-[4vw]'>
        <h1 className="text-[5vh] font-bold text-cyan-600 my-[5vh]">Contacts</h1>
        <div className='flex justify-between items-center'>
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