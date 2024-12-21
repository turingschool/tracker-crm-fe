import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getACompany } from "../../trackerApiCalls";
import { useUserLoggedContext } from '../../context/UserLoggedContext';

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
  contacts: any; // Update this when you want to use the contacts data
}

const mockContacts = [
  { id: 1, name: "John Doe", userId: 101 },
  { id: 2, name: "Jane Smith", userId: 102 },
  { id: 3, name: "Alice Johnson", userId: 103 },
];

function CompanyShow() {
  const { id } = useParams<{ id: string }>();
  const { token, userData} = useUserLoggedContext();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <div className="flex flex-col space-y-4">
            {mockContacts.map((contact) => (
              <Link
                key={contact.id}
                to={`/contacts/${contact.userId}`}
                className="text-blue-500 hover:underline text-lg font-semibold"
              >
                {contact.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Link to="/companies" className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-6 inline-block">
        Back to Companies
      </Link>
    </div>
  );
}

export default CompanyShow;