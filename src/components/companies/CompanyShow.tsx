import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Company } from "../../Interfaces";

function CompanyShow(){
  const { id } = useParams();
  console.log("show:", id)
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJyb2xlcyI6WyJ1c2VyIl0sImV4cCI6MTczNDY0MTg2Mn0.4GEWX2QPGGKfBJ8C0f4uqDzt3bumLAChqDPO4PkAM38";
        const response = await fetch(`http://localhost:3001/api/v1/companies/${id}/contacts`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        console.log("response:", response)
        if (!response.ok) {
          throw new Error(`Failed to fetch company: ${response.statusText}`);
        }
        const data = await response.json();
        setCompany(data.data as Company);
        console.log("data:", data.data);
      } catch (error) {
        console.error("Fetch error", error);
      }
    }
    fetchCompany();
  }, []);
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Company</h1>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label className="mb-2 text-gray-700">Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={company?.attributes.name}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-gray-700">Website:</label>
          <input
            type="text"
            id="website"
            value={company?.attributes.website}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-gray-700">Street Address:</label>
          <input
            type="text"
            id="streetAddress"
            value={company?.attributes.street_address}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-gray-700">City:</label>
          <input
            type="text"
            id="city"
            value={company?.attributes.city}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-gray-700">State:</label>
          <input
            type="text"
            id="state"
            value={company?.attributes.state}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />  
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-gray-700">Zip Code:</label>
          <input
            type="text"
            id="zipCode"
            value={company?.attributes.zip_code}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-gray-700">Notes:</label>
          <textarea
            id="notes"
            value={company?.attributes.notes}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>
      </div>
      <Link
        to="/companies"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
      > Back to Companies</Link>
    </div>
  )
}

export default CompanyShow;