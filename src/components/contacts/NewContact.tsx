import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserLoggedContext } from "../../context/UserLoggedContext";
import { fetchCompanies } from "../../apiCalls";
import { fetchNewContact } from "../../apiCalls";
import { UserInformationProps, FormInputData } from "../../Interfaces";
import CompanyModal from "./CompanyModal";

const NewContact = ({ userData }: UserInformationProps) => {
  const navigate = useNavigate();

  const { token } = useUserLoggedContext();
  const userId = userData.user.data.id
    ? Number(userData.user.data.id)
    : undefined;

  const [formInputData, setFormInputData] = useState<FormInputData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    companyId: null,
    notes: "",
  });

  const [feedback, setFeedback] = useState<string | null>(null);
  const [companies, setCompanies] = useState<{ id: number; name: string }[]>(
    []
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const companiesFetcher = async () => {
    try {
      const allData = await fetchCompanies(userId, token);
      return setCompanies(allData);
    } catch (error: any) {
      console.error("Error fetching companies:", error.message);
    }
  };

  useEffect(() => {
    companiesFetcher(); // Runs on mount
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const phoneInput = value.replace(/\D/g, "");
      setFormInputData((prev) => ({
        ...prev,
        [name]: phoneInput,
      }));
    } else {
      setFormInputData((prev) => ({
        ...prev,
        [name]: value === " " ? null : value,
      }));
    }
  };

  const handleCompanyCreated = (
    newCompanyId: number,
    newCompanyName: string
  ) => {
    setCompanies((prevCompanies) => [
      ...prevCompanies,
      { id: newCompanyId, name: newCompanyName },
    ]);
    setFormInputData((prev) => ({
      ...prev,
      companyId: newCompanyId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newContact = {
      first_name: formInputData.firstName,
      last_name: formInputData.lastName,
      email: formInputData.email,
      phone_number: formInputData.phoneNumber,
      notes: formInputData.notes,
    };

    try {
      await fetchNewContact(userId, token, formInputData, newContact);
      setFeedback("Contact added successfully! Redirecting...");
      setTimeout(() => navigate("/contacts"), 3000);
    } catch (error: any) {
      console.error("Error adding contact:", error);
      setFeedback(error.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-[50vw] mx-auto my-[2vh] p-[3vh] ">
        <h1 className="text-[5vh] font-bold mb-6 text-cyan-600">
          Add New Contact
        </h1>
        {feedback && (
          <div
            className={`p-4 mb-6 rounded ${
              feedback.startsWith("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {feedback}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-gray-700 font-medium mb-1"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name is required"
                value={formInputData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-gray-700 font-medium mb-1"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name is required"
                value={formInputData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-[1vh]"
            >
              Email
            </label>
            <input
              className="w-full px-[1vw] py-[1vh] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              value={formInputData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-gray-700 font-medium mb-1"
            >
              Phone Number
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="555-555-5555"
              value={formInputData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="companyId"
              className="block text-gray-700 font-medium mb-1"
            >
              Company
            </label>
            <select
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                !formInputData.companyId ? "text-gray-400" : "text-black"
              }`}
              id="companyId"
              name="companyId"
              value={formInputData.companyId || ""}
              onFocus={() => companiesFetcher()}
              onChange={handleInputChange}
            >
              <option value="" className="text-gray-400">
                Leave blank or select a company
              </option>

              {companies.map((company) => (
                <option
                  key={company.id}
                  value={company.id}
                  className="text-black"
                >
                  {company.name}
                </option>
              ))}
            </select>
            <div>
              <button
                className="bg-cyan-600 text-white px-[.5vw] py-[1vh] rounded w-[18vw] hover:bg-cyan-700 focus:ring-cyan-500 focus:ring-2 mt-3"
                onClick={() => setIsOpen(true)}
              >
                Add new company
              </button>
              <CompanyModal
                open={isOpen}
                setIsOpen={setIsOpen}
                onCompanyCreated={handleCompanyCreated}
              ></CompanyModal>
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-gray-700 font-medium mb-1"
            >
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              id="notes"
              name="notes"
              placeholder="Add notes here"
              rows={5}
              cols={50}
              value={formInputData.notes}
              onChange={handleInputChange}
            />
          </div>

          <div className="text-left">
            <button
              type="submit"
              className="bg-cyan-600 text-white px-[2vw] py-[1vh] rounded w-[10vw] hover:bg-cyan-700 focus:ring-cyan-500 focus:ring-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewContact;
