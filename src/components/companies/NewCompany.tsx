import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompanies, createCompany } from "../../trackerApiCalls";
import { CompanyAttributes } from "../../Interfaces";
import { useUserLoggedContext } from "../../context/UserLoggedContext";

function NewCompany() {
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

  useEffect(() => {
    const getCompanies = async () => {
      if (token && userData?.user?.data?.id) {
        const companies = await fetchCompanies(userData.user.data.id, token);
        setExistingCompanies(companies || []);
      }
    };

    getCompanies();
  }, [token, userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrors({ name: "Company name is required." });
      return;
    }

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
      await createCompany(userData.user.data.id, token, newCompany);
      setSuccessMessage("Company added successfully!");

      // Delay navigation to give time for success message to display
      if (window.location.href.includes("companies")) {
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
        <h1 className="text-2xl font-bold mb-4">Add New Company</h1>
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
        <form className="flex flex-col space-y-4">
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
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
            {errors.duplicate && (
              <p className="text-red-500 mt-1">{errors.duplicate}</p>
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
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">State:</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
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
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">Notes:</label>
            <textarea
              value={notes}
              placeholder="Notes about the company"
              onChange={(e) => setNotes(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
