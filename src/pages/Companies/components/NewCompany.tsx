import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompanies, createCompany } from "../../../constants/trackerApiCalls";
import { CompanyAttributes } from "../../../constants/Interfaces";
import { useUserLoggedContext } from "../../../context/UserLoggedContext";
import { useErrorContext } from "../../../context/ErrorContext"; 
import TipTap from '../../../wysiwyg/TipTap';
import US_STATES from "../../../constants/states";

interface NewCompanyProps {
  isModal?: boolean;
  onSuccess?: (newCompanyId: number, newCompanyName: string) => void;
}

function NewCompany({ isModal, onSuccess }: NewCompanyProps) {
  const navigate = useNavigate();
  const { token, userData } = useUserLoggedContext();

  const [name, setName] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [existingCompanies, setExistingCompanies] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; duplicate?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setErrors: setBackendErrors } = useErrorContext()
  const { errorMessages } = useErrorContext();

  useEffect(() => {
    const getCompanies = async () => {
      if (token && userData?.user?.data?.id) {
        const result = await fetchCompanies(
          userData.user.data.id,
          token!,
          setBackendErrors  
        );
        if (result.data) {
          setExistingCompanies(result.data);
        } else {
          setExistingCompanies([]);
        }
      }
    };
  
    getCompanies();
  }, [token, userData]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (errorMessages.length > 0) {
      timer = setTimeout(() => {
        setBackendErrors([]);
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [errorMessages, setBackendErrors]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);
  
    const isDuplicate = existingCompanies.some(
      (company) =>
        company.attributes.name.toLowerCase() === name.trim().toLowerCase()
    );
  
    if (isDuplicate) {
      setErrors({ duplicate: "A company with this name already exists." });
      return;
    }
  
    const newCompany: CompanyAttributes = {
      id: 0,
      name,
      website,
      street_address: streetAddress,
      city,
      state,
      zip_code: zipCode,
      notes,
    };
  
    try {
      if (!token || !userData?.user?.data?.id) {
        console.error("Missing token or user ID");
        return;
      }
  
      setIsLoading(true);
      const result = await createCompany(
        userData.user.data.id,
        token,
        newCompany,
        setBackendErrors
      );
      setIsLoading(false);
  
      if (result.error) {
        setErrors({ name: result.error });
        return;
      }
  
      setSuccessMessage("Company added successfully!");
  
      if (isModal && onSuccess) {
        onSuccess(result.data.data.id, result.data.data.attributes.name);
      } else if (window.location.href.includes("companies")) {
        setTimeout(() => {
          navigate("/companies");
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding company:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (

    <div className="flex flex-row">
      <div className="max-w-4xl w-10/12  m-auto p-12 justify-self-center bg-white border border-gray-200 rounded-lg shadow-lg">
      {errorMessages.length > 0 && (
      <div className="mb-4">
        {errorMessages.map((msg, index) => (
          <p key={index} className=" text-red-700 bg-red-100 p-3 rounded-md" data-testid="backend-error">
            {msg}
          </p>
        ))}
      </div>
      )}
        <h1 className="text-2xl text-cyan-600 font-bold mb-4">Add New Company</h1>
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
        <form className="flex flex-col space-y-4 z-1">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">
              Company Name: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              value={name}
              placeholder="Company Name"
              onChange={(e) => setName(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            {errors.name && (
              <p className="text-red-500" data-testid="company-error">
                {errors.name}
              </p>
            )}
            {errors.duplicate && (
              <p className="text-red-500" data-testid="company-error">
                {errors.duplicate}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">Website:</label>
            <input
              type="text"
              id="website"
              value={website}
              placeholder="https://example.com"
              onChange={(e) => setWebsite(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">Street Address:</label>
            <input
              type="text"
              id="streetAddress"
              value={streetAddress}
              placeholder="123 Main St"
              onChange={(e) => setStreetAddress(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">City:</label>
            <input
              type="text"
              id="city"
              value={city}
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">State:</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select State</option>
              {US_STATES.map(({ code, name }) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">Zip Code:</label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              placeholder="12345"
              onChange={(e) => setZipCode(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">Notes:</label>
            <div className="ProseMirror z-0" data-cy="tiptap-notes-container">
              <TipTap 
                content={notes}
                placeholder={"Notes ... "}
                onUpdate={(html: string) => setNotes(html)}
              />
            </div>
          </div>
          <button
            type="submit"
            className={`mt-4 bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default NewCompany;
