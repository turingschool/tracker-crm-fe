import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getACompany } from "../../trackerApiCalls";
import { useUserLoggedContext } from '../../context/UserLoggedContext';
import { US_STATES } from "../../constants/states";

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
  const [selectedState, setSelectedState] = useState("");
  
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
  
  useEffect(() => {
    if (isEditModalOpen) {
      const companyState = companyData?.company?.data?.attributes?.state;
      if (companyState) {
        let foundState = US_STATES.find((s) => s.code === companyState)?.code;
        if (!foundState) {
          foundState = US_STATES.find((s) => s.name.toLowerCase() === companyState.toLowerCase())?.code;
        }
        setSelectedState(foundState || "");
      } else {
        setSelectedState("");
      }
    }
  }, [isEditModalOpen, companyData]);
  
  if (isLoading) {
    return <p className="text-center mt-10">Loading company details...</p>;
  }
  
  if (error) {
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  }
  
  if (!companyData) {
    return <p className="text-center mt-10">No company data found</p>;
  }
  
  const companyContacts = companyData?.contacts?.data ?? [];
  const companyAttributes = companyData?.company?.data?.attributes ?? {
    name: "",
    website: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
    notes: ""
  };
  
  
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
                href={companyAttributes.website ? 
                  (companyAttributes.website.startsWith("http") ? companyAttributes.website : `https://${companyAttributes.website}`) 
                  : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className={companyAttributes.website ? "text-blue-500 hover:underline" : "text-gray-500"}
              >
                {companyAttributes.website || "N/A"}
              </a>
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700">Address:</h2>
            <p className="text-gray-900">
            {[
              companyAttributes.street_address,
              companyAttributes.city,
              companyAttributes.state,
              companyAttributes.zip_code
            ]
              .filter(Boolean)
              .join(", ") || "N/A"}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700">Notes:</h2>
            <p className="text-gray-900">{companyAttributes.notes?.trim() || "N/A"}</p>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={() => setIsEditModalOpen(false)}>
          <div className="bg-white w-[50vw] mx-auto my-[2vh] p-[3vh] rounded-lg shadow-lg relative" onClick={(event) => event.stopPropagation()}>
            
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setIsEditModalOpen(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6">Edit Company</h2>

            <div className="grid grid-cols-2 gap-4">

              {/* Name Field */}
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-[1vh]">Name</label>
                <input 
                  className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                  defaultValue={companyAttributes.name}
                  placeholder="Company Name"
                />
              </div>

              {/* Website Field */}
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-[1vh]">Website</label>
                <input 
                  className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                  defaultValue={companyAttributes.website}
                  placeholder="https://example.com"
                />
              </div>

              {/* Street Address */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-[1vh]">Street Address</label>
                <input 
                  className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                  defaultValue={companyAttributes.street_address}
                  placeholder="123 Main St"
                />
              </div>

              {/* City Field */}
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-[1vh]">City</label>
                <input 
                  className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                  defaultValue={companyAttributes.city}
                  placeholder="City"
                />
              </div>

              {/* State Dropdown */}
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-[1vh]">State</label>
                <select
                  className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 overflow-y-auto"
                  value={selectedState}
                  onChange={(event) => setSelectedState(event.target.value)}
                >
                <option value="" disabled>
                  Select a State
                </option>

                <option value="no-selection">No Selection</option>
                
                {US_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
                </select>
              </div>

              {/* Zip Code */}
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-[1vh]">Zip</label>
                <input 
                  className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                  defaultValue={companyAttributes.zip_code}
                  placeholder="12345"
                />
              </div>

              {/* Notes */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-[1vh]">Notes</label>
                <textarea 
                  className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                  rows={3}
                  defaultValue={companyAttributes.notes}
                  placeholder="Notes about the company"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6">
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