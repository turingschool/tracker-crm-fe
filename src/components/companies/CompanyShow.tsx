import { useEffect, useState } from "react";
import { US_STATES } from "../../constants/states";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getACompany, deleteItem, updateCompany } from "../../trackerApiCalls";
import { useUserLoggedContext } from '../../context/UserLoggedContext';
import  DeleteItem  from "../common/DeleteItem";

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
  const navigate = useNavigate();
  const { token, userData} = useUserLoggedContext();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNameValid, setIsNameValid] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    streetAddress: "",
    city: "",
    selectedState: "",
    zipCode: "",
    notes: ""
  });

  
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

        const attributes = data?.company?.data?.attributes || {};
        setFormData({
          name: attributes.name || "",
          website: attributes.website || "",
          streetAddress: attributes.street_address || "",
          city: attributes.city || "",
          selectedState: attributes.state || "",
          zipCode: attributes.zip_code || "",
          notes: attributes.notes || ""
        });
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
  if (companyData) {
    const attributes = companyData.company.data.attributes;
    setFormData({
      name: attributes.name || "",
      website: attributes.website || "",
      streetAddress: attributes.street_address || "",
      city: attributes.city || "",
      selectedState: attributes.state || "",
      zipCode: attributes.zip_code || "",
      notes: attributes.notes || ""
    });
  }
}, [companyData]);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setIsNameValid(false);
      return;
    }
  
    try {
      const updatedCompany = {
        name: formData.name,
        state: formData.selectedState || null,
        website: formData.website || null,
        street_address: formData.streetAddress || null,
        city: formData.city || null,
        zip_code: formData.zipCode || null,
        notes: formData.notes || null,
      };
  
      const companyId = parseInt(id!);
      const updatedData = await updateCompany(userData.user.data.id, token!, companyId, updatedCompany);
  
      if (!updatedData || !updatedData.data) {
        throw new Error("Invalid API response structure: Missing 'data'");
      }
  
      setCompanyData((prevData) => ({
        company: {
          data: {
            attributes: {
              ...(prevData?.company?.data?.attributes || {}),
              ...(updatedData.data.attributes || {}),
            },
          },
        },
        contacts: prevData?.contacts ?? { data: [] },
      }));
  
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };
  
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
  const formatZipCode = (value: string) => {
    const digits = value.replace(/\D/g, "");
  
    if (digits.length <= 5) {
      return digits;
    }
  
    return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
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
                companyAttributes.state
              ]
                .filter(Boolean)
                .join(", ") + (companyAttributes.zip_code ? ` ${companyAttributes.zip_code}` : "") || "N/A"}
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
          data-cytest="edit-button"
          className="border border-cyan-600 text-cyan-600 bg-white px-[2vw] py-[1vh] rounded w-[10vw] hover:bg-gray-100"
          onClick={handleEditClick}
        >
          Edit
        </button>
      </div>
        
      {/* Delete Button */}
      <DeleteItem
        userId={userData.user.data.id}
        itemId={id!}
        itemType="company"
        deleteAction={deleteItem}
        token={token!}
        onDeleteSuccess={() => navigate("/companies")}
      />

      {isEditModalOpen && (
        <div
          data-cytest="modal"
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsEditModalOpen(false);
            }
          }}
        >
          <div className="bg-white w-[50vw] mx-auto my-[2vh] p-[3vh] rounded-lg shadow-lg relative" onClick={(event) => event.stopPropagation()}>
            
            {/* Close Button */}
            <button
              data-cytest="close-button"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setIsEditModalOpen(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6">Edit Company</h2>
            <div className="grid grid-cols-2 gap-4">

              {/* Name Field */}
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-[1vh]">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  data-cytest="name-input"
                  className={`w-full px-[1vh] py-[1vh] border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    isNameValid ? "border-black" : "border-red-500"
                  }`}
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => {
                    if (!formData.name.trim()) {
                      setIsNameValid(false);
                    }
                  }}
                  placeholder="Company Name"
                />
                {!isNameValid && <p data-cytest="name-error" className="text-red-500 text-sm">
                  Company name is required.
                  </p>}
              </div>

              {/* Website Field */}
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-[1vh]">Website</label>
                <input
                  name="website"
                  data-cytest="website-input"
                  className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>

              {/* Street Address */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-[1vh]">Street Address</label>
                <input
                  name="streetAddress"
                  data-cytest="street-address-input"
                  className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="123 Main St"
                />
              </div>

              {/* City Field */}
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-[1vh]">City</label>
                <input
                  name="city"
                  data-cytest="city-input"
                  className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                />
              </div>

              {/* State Dropdown */}
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-[1vh]">State</label>
                <select
                  name="selectedState"
                  data-cytest="state-select"
                  className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 overflow-y-auto"
                  value={formData.selectedState}
                  onChange={handleInputChange}
                >
                  <option value="">Select a State</option>
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
                  name="zipCode"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  data-cytest="zip-code-input"
                  className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.zipCode}
                  onChange={(e) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      zipCode: formatZipCode(e.target.value),
                    }));
                  }}
                  placeholder="12345 or 12345-6789"
                />
              </div>

              {/* Notes */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-[1vh]">Notes</label>
                <textarea
                  name="notes"
                  data-cytest="notes-input"
                  className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Notes about the company"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6">
              <button
                data-cytest="save-button"
                className="bg-cyan-600 text-white px-[2vw] py-[1vh] rounded w-[10vw] hover:bg-cyan-700 focus:ring-cyan-500 focus:ring-2"
                onClick={handleSave}
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