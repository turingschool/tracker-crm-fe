import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getACompany } from "../../trackerApiCalls";
import { useUserLoggedContext } from '../../context/UserLoggedContext';

interface ContactData {
  id: string;
  type: string;
  attributes: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    notes: string;
    user_id: number;
  }
}

interface CompanyData {
  company: {
    data: {
      attributes: {
        name: string;
        website: string;
        street_address: string;
        city: string;
        state: string;
        zip_code: string;
        notes: string;
      }
    }
  },
  contacts: {
    data: ContactData[];
  }
}

function CompanyShow() {
  const { id } = useParams<{ id: string }>();
  const { token, userData} = useUserLoggedContext();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    console.log("Fetching company data...");
    setIsLoading(true);
    const fetchCompanyData = async () => {
      try {
        if (!id) {
          throw new Error("Company ID is missing");
        }
        const companyId = parseInt(id);
        const data = await getACompany(userData.user.data.id, token!, companyId);
        setCompanyData(data);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setError(error instanceof Error ? error.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
        console.log("Loading complete");
      }
    };
  
    fetchCompanyData();
  }, [token, userData, id]);

  if (isLoading) {
    return <p className="text-center mt-10">Loading company details...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  }

  if (!companyData) {
    return <p className="text-center mt-10">No company data found</p>;
  }

  const companyAttributes = companyData.company.data.attributes;
  const companyContacts = companyData.contacts.data;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Company Details</h1>
      <div className="flex justify-between items-start space-x-8">
        {/* Company Details */}
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold text-gray-700">Company Name:</h2>
            <p className="text-gray-900">{companyAttributes.name}</p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700">Website:</h2>
            <p className="text-blue-500 hover:underline">
              <a
                href={companyAttributes.website.startsWith("http") ? companyAttributes.website : `https://${companyAttributes.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {companyAttributes.website}
              </a>
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700">Address:</h2>
            <p className="text-gray-900">
              {companyAttributes.street_address} {companyAttributes.city}, {companyAttributes.state} {companyAttributes.zip_code}</p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700">Notes:</h2>
            <p className="text-gray-900">{companyAttributes.notes}</p>
          </div>
        </div>

        {/* Contacts Section */}
        <div className="w-1/2">
          <h2 className="text-xl font-bold mb-4">Contacts</h2>
          {companyContacts.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {companyContacts.map((contact) => (
                <Link
                  key={contact.id}
                  to={`/contacts/${contact.id}`}
                  className="text-blue-500 hover:underline text-lg font-semibold"
                >
                  {contact.attributes.first_name} {contact.attributes.last_name}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No contacts found for this company</p>
          )}
        </div>
      </div>

      {/* Edit Button */}
      <div className="mt-6">
        <button
          className="border border-cyan-600 text-cyan-600 bg-white px-[2vw] py-[1vh] rounded w-[10vw] hover:bg-gray-100"
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit
        </button>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[50vw]">
            <h2 className="text-xl font-bold mb-4">Edit Company</h2>
            
            <input className="w-full px-[1vh] py-[1vh] border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500" defaultValue={companyAttributes.name} />
            <input className="w-full px-[1vh] py-[1vh] border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 mt-4" defaultValue={companyAttributes.website} />
            

            <div className="flex justify-end space-x-2 mt-4">
              <button 
                className="border border-cyan-600 text-cyan-600 bg-white px-[2vw] py-[1vh] rounded w-[10vw] hover:bg-gray-100"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-cyan-600 text-white px-[2vw] py-[1vh] rounded w-[10vw] hover:bg-cyan-700 focus:ring-cyan-500 focus:ring-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyShow;