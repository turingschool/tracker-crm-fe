import { useEffect, useState } from "react";
import { US_STATES } from "../../../constants/states";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getACompany, deleteItem, updateCompany } from "../../../constants/trackerApiCalls";
import { useUserLoggedContext } from '../../../context/UserLoggedContext';
import HTMLRender from "../../../wysiwyg/HTMLRender"; 
import  DeleteItem  from "../../../constants/DeleteItem";
import { useErrorContext } from "../../../context/ErrorContext";
import { CompanyData } from "../../../constants/Interfaces";

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
    if (!id || !token || !userData?.user?.data?.id) return;

    console.log("Fetching company data...");
    setIsLoading(true);

    const fetchCompanyData = async () => {
      try {
        if (!id) {
          setError("Company ID is missing");
          setIsLoading(false);
          return;
        }

        const companyId = parseInt(id);
        const result = await getACompany(userData.user.data.id, token, companyId, setBackendErrors);

        if (result.error) {
          setError(result.error);
          setIsLoading(false);
          return;
        }

        if (!result.data) {
          setError("No data returned from API.");
          setIsLoading(false);
          return;
        }

        const contacts = {
          data: Array.isArray(result.data?.contacts?.data) ? result.data.contacts.data : [],
        };
        const company = result.data?.company ?? {
          data: {
            attributes: {
              name: "",
              website: "",
              street_address: "",
              city: "",
              state: "",
              zip_code: "",
              notes: "",
            },
          },
        };

        setCompanyData({ company, contacts });
        setName(company.data.attributes.name);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setError(error instanceof Error ? error.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
        console.log("Loading complete");
      }
    };

    fetchCompanyData();
  }, [id, token, userData?.user?.data?.id ?? ""]);

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
    return <p
      data-cytest="error"
      className="text-center mt-10 text-red-500">Error: {error}
      </p>;
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
  const companyAddress = companyAttributes?.street_address + ", " + companyAttributes.city + ", " + companyAttributes.state + " " + companyAttributes.zip_code

  return (
    <main className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-6">
      <h1 className=" mt-[10vh] ml-[6vw] w-full text-xl sm:text-3xl md:text-5xl font-bold text-cyan-600 tracking-wide">
        {companyAttributes.name}
      </h1>
      <div className="flex gap-[8vw]">
        <div className="pl-[6vw] mt-[3vh] flex-1">
          <h2 className="mb-[5vh] text-[3vh] text-cyan-700 hover:underline underline-offset-8 hover:text-cyan-500">
          <Link
            to={
              companyAttributes.website
                ? companyAttributes.website.startsWith("http")
                  ? companyAttributes.website
                  : `https://${companyAttributes.website}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {companyAttributes.website || "No website provided"}
          </Link>
          </h2>

          {/* Company Details */}  
          <div className="space-y-4 my-[6vh] pr-[12vw]">
            <div 
            id = "address"
            className="flex flex-row my-[6vh]">
              <span className="text-lg text-gray-700 font-semibold pr-4">
                Address
              </span>
              <p className="text-lg text-gray-600">
                {companyAddress}
              </p>
            </div>
            <div
              id = "notes"
            >
              <span className="text-[2.5vh] font-bold text-cyan-700">
                Notes
              </span>
              <p className="text-gray-600 whitespace-pre-wrap">
                {<HTMLRender htmlString={companyAttributes.notes || ''} />}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-[10vh] flex flex-col items-center space-y-4 ml-[-16vw]">

            {/* Edit Button */}
            <button
              data-testid="edit-button"
              className="border-2 border-cyan-600 text-cyan-700 px-8 py-2 rounded hover:bg-cyan-600 hover:text-white transition-all"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit
            </button>
              
            {/* Delete Button */}
            <DeleteItem
              userId={userData.user.data.id}
              itemId={id!}
              itemType="company"
              deleteAction={deleteItem}
              token={token!}
              onDeleteSuccess={() => navigate("/companies")}
            />
        </div>
      </div>
      
      {/* Contacts Section */}
      <div className="my-[3vh] mr-[20vw] flex-1">
        <h3
          id = "other-contacts"
          className = "w-full text-xl sm:text-3xl md:text-5xl font-bold text-cyan-700 mb-[4vh] text-wrap"
        >
          {companyAttributes.name
            ? `My contacts at ${companyAttributes.name}`
            : `No contacts found at ${companyAttributes.name}`}
        </h3>
        <ul className="list-none">
          {companyContacts.map((contact) => (
            <li 
              key={contact.id} 
              data-testid={`contact-link-${contact.id}`}
              className="text-2xl font-medium text-cyan-700 mb-[2vh]">
                <Link
                  className="text-cyan-600 hover:text-cyan-500 no-underline"
                  to={`/contacts/${contact.id}`}
                >
                  {contact.attributes.first_name} {contact.attributes.last_name}
                </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

{/* Edit Modal */}
    {isEditModalOpen && (
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
        onClick={() => setIsEditModalOpen(false)}
      >
        <div 
          data-testid="edit-modal"
          className="bg-white w-[50vw] mx-auto my-[2vh] p-[3vh] rounded-lg shadow-lg relative" onClick={(event) => event.stopPropagation()}
        >
          
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
              {!isNameValid && <p data-cytest="name-error" className="text-red-500 text-sm">
                Company name is required.
                </p>}
            </div>

            {/* Website Field */}
            <div className="col-span-1">
              <label className="block text-gray-700 font-medium mb-[1vh]">Website</label>
              <input
                data-cytest="website-input"
                className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                defaultValue={companyAttributes.website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            {/* Street Address */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-[1vh]">Street Address</label>
              <input
                data-cytest="street-address-input"
                className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                defaultValue={companyAttributes.street_address}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="123 Main St"
              />
            </div>

            {/* City Field */}
            <div className="col-span-1">
              <label className="block text-gray-700 font-medium mb-[1vh]">City</label>
              <input
                data-cytest="city-input"
                className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                defaultValue={companyAttributes.city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>

            {/* State Dropdown */}
            <div className="col-span-1">
              <label className="block text-gray-700 font-medium mb-[1vh]">State</label>
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

            {/* Zip Code */}
            <div className="col-span-1">
              <label className="block text-gray-700 font-medium mb-[1vh]">Zip</label>
              <input
                data-cytest="zip-code-input"
                className="w-full px-[1vh] py-[1vh] border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                defaultValue={companyAttributes.zip_code}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="12345"
              />
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-[1vh]">Notes</label>
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
    </main>
  );
}

export default CompanyShow