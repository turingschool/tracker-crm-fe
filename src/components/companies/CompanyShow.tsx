import { useEffect, useState } from "react";
import { US_STATES } from "../../constants/states";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getACompany, deleteItem, updateCompany } from "../../trackerApiCalls";
import { useUserLoggedContext } from '../../context/UserLoggedContext';
import  DeleteItem  from "../common/DeleteItem";
import { useErrorContext } from "../../context/ErrorContext";


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
  const { setErrors: setBackendErrors, errorMessages } = useErrorContext();
  const { token, userData} = useUserLoggedContext();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");
  const [name, setName] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [website, setWebsite] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [notes, setNotes] = useState("");


  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);
      if (!id) {
        setError("Company ID is missing");
        setIsLoading(false);
        return;
      }
      const companyId = parseInt(id);
      const result = await getACompany(userData.user.data.id, token!, companyId, setBackendErrors);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setCompanyData(result.data);
        setName(result.data.company.data.attributes.name || "");
      }
      setIsLoading(false);
      console.log("Loading complete");
    };
  
    fetchCompanyData();
  }, [token, userData, id]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (errorMessages.length > 0) {
      timer = setTimeout(() => {
        setBackendErrors([]);
      }, 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errorMessages, setBackendErrors]);

  useEffect(() => {
    if (isEditModalOpen && companyData) {
      const attributes = companyData.company.data.attributes;
      setName(attributes.name || "");
      setWebsite(attributes.website || "");
      setStreetAddress(attributes.street_address || "");
      setCity(attributes.city || "");
      setZipCode(attributes.zip_code || "");
      setNotes(attributes.notes || "");

      const companyState = attributes.state;
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


  const handleSave = async () => {
    if (!name.trim()) {
      setIsNameValid(false);
      return;
    }
  
    try {
      const updatedCompany = {
        name,
        state: selectedState || null,
        website: website || null,
        street_address: streetAddress || null,
        city: city || null,
        zip_code: zipCode || null,
        notes: notes || null,
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
  

  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
        {errorMessages.length > 0 && (
          <div className="mb-4">
            {errorMessages.map((msg, index) => (
              <p key={index} className="text-red-700 bg-red-100 p-3 rounded-md">
                {msg}
              </p>
            ))}
          </div>
        )}
        {error && <p className="text-center mt-10 text-red-500">Error: {error}</p>}
        <h1 className="text-2xl font-bold mb-6">Company Details</h1>
        <div className="flex justify-between items-start space-x-8">
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-gray-700">Company Name:</h2>
              <p className="text-gray-900">{companyAttributes.name}</p>
            </div>
  
            <div>
              <h2 className="font-semibold text-gray-700">Website:</h2>
              <p className="text-blue-500 hover:underline">
                <a
                  href={
                    companyAttributes.website
                      ? companyAttributes.website.startsWith("http")
                        ? companyAttributes.website
                        : `https://${companyAttributes.website}`
                      : "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    companyAttributes.website
                      ? "text-blue-500 hover:underline"
                      : "text-gray-500"
                  }
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
                ]
                  .filter(Boolean)
                  .join(", ") +
                  (companyAttributes.zip_code ? ` ${companyAttributes.zip_code}` : "") ||
                  "N/A"}
              </p>
            </div>
  
            <div>
              <h2 className="font-semibold text-gray-700">Notes:</h2>
              <p className="text-gray-900">
                {companyAttributes.notes?.trim() || "N/A"}
              </p>
            </div>
          </div>
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
              <p className="text-gray-500">
                No contacts found for this company
              </p>
            )}
          </div>
        </div>
        <div className="mt-6">
          <button
            data-cytest="edit-button"
            className="border border-cyan-600 text-cyan-600 bg-white px-[2vw] py-[1vh] rounded w-[10vw] hover:bg-gray-100"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </button>
        </div>

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
            onClick={() => setIsEditModalOpen(false)}
          >
            <div
              className="bg-white w-[50vw] mx-auto my-[2vh] p-[3vh] rounded-lg shadow-lg relative"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                data-cytest="close-button"
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => setIsEditModalOpen(false)}
              >
                &times;
              </button>
  
              <h2 className="text-2xl font-bold mb-6">Edit Company</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-gray-700 font-medium mb-[1vh]">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    data-cytest="name-input"
                    className={`w-full px-[1vh] py-[1vh] border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      isNameValid ? "border-black" : "border-red-500"
                    }`}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.trim().length > 0) {
                        setIsNameValid(true);
                      }
                    }}
                    onBlur={() => {
                      if (!name.trim()) {
                        setIsNameValid(false);
                      }
                    }}
                    placeholder="Company Name"
                  />
                  {!isNameValid && (
                    <p data-cytest="name-error" className="text-red-500 text-sm">
                      Company name is required.
                    </p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-medium mb-[1vh]">
                    Website
                  </label>
                  <input
                    data-cytest="website-input"
                    className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    defaultValue={companyAttributes.website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 font-medium mb-[1vh]">
                    Street Address
                  </label>
                  <input
                    data-cytest="street-address-input"
                    className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    defaultValue={companyAttributes.street_address}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-medium mb-[1vh]">
                    City
                  </label>
                  <input
                    data-cytest="city-input"
                    className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    defaultValue={companyAttributes.city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-medium mb-[1vh]">
                    State
                  </label>
                  <select
                    data-cytest="state-select"
                    className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 overflow-y-auto"
                    value={selectedState}
                    onChange={(event) => setSelectedState(event.target.value)}
                  >
                    <option value="">Select a State</option>
                    {US_STATES.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-gray-700 font-medium mb-[1vh]">
                    Zip
                  </label>
                  <input
                    data-cytest="zip-code-input"
                    className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    defaultValue={companyAttributes.zip_code}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="12345"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 font-medium mb-[1vh]">
                    Notes
                  </label>
                  <textarea
                    data-cytest="notes-input"
                    className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows={3}
                    defaultValue={companyAttributes.notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes about the company"
                  />
                </div>
              </div>
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
    </>
  );
}

export default CompanyShow;