import { useState, useEffect } from "react";
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
  
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJleHAiOjE3MzQxMzczNTV9.JTg4088WxutlaNjmcIqYBLMPqGzeHdwx94PxUdOMxyA";
        const response = await fetch("http://localhost:3001/api/v1/users/4/contacts", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data.data);
        setContacts(data.data as ContactData[]);
        // setFilteredCompanies(data.data as Company[]);
      } catch (error) {
        console.error("Fetch error", error);
      }
    };
    fetchContacts();
  }, []);

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
      <div className='w-[70vw]'>
        <h1 className="text-[5vw] font-bold text-cyan-600">Contacts</h1>
        <div className='flex justify-between'>
          <input
          // className='p-2 border-2 border-slate-800 rounded w-[12vw] h-full max-h-24'
          className='p-2 border-2 border-slate-800 rounded w-[12vw] h-full'
          type='text'
          // value={}
          placeholder='Search contacts...'
          />
          <button className='bg-cyan-600 text-white px-4 py-2 rounded w-[10vw] h-full max-h-24'>Add New +</button>
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