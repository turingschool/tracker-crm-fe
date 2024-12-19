import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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
  const { id } = useParams();
  const userId = 2;
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJyb2xlcyI6WyJ1c2VyIl0sImV4cCI6MTczNDY0MTg2Mn0.4GEWX2QPGGKfBJ8C0f4uqDzt3bumLAChqDPO4PkAM38";
        const response = await fetch(`http://localhost:3001/api/v1/users/${userId}/companies/${id}/contacts`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch company: ${response.statusText}`);
        }

        const data = await response.json();
        setCompanyData(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error instanceof Error ? error.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

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
      {/* Company Details */}
      <h1 className="text-2xl font-bold mb-6">Company Details</h1>

      <div className="space-y-4">
        <div>
          <h2 className="font-semibold text-gray-700">Company Name:</h2>
          <p className="text-gray-900">{companyAttributes.name}</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-700">Website:</h2>
          <p className="text-blue-500 hover:underline">
            <a href={companyAttributes.website} target="_blank" rel="noopener noreferrer">
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
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Contacts</h2>
        <div className="grid gap-4">
          {mockContacts.map((contact) => (
            <div key={contact.id} className="p-4 border rounded-lg bg-gray-50">
              <Link
                to={`/contacts/${contact.userId}`}
                className="text-blue-500 hover:underline text-lg font-semibold"
              >
                {contact.name}
              </Link>
            </div>
          ))}
      </div>
    </div>


      <Link to="/companies" className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-6 inline-block">
        Back to Companies
      </Link>
    </div>
  );
}

export default CompanyShow;