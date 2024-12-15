import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuBar from '../layout/MenuBar';

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  currentCompany: string;
  notes: string;
}

const NewContact = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    currentCompany: '',
    notes: '',
  });
// added for feedback
  const [feedback, setFeedback] = useState<string | null>(null);


  // companies for the current company field, placeholder for now
  const companies = ['Company A', 'Company B', 'Company C'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newContact = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      current_company: formData.currentCompany,
      notes: formData.notes,
    };

    try {
      // const token = "YOUR_AUTH_TOKEN_HERE";
      const token =
        "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJleHAiOjE3MzQyMDQ1NDR9.H9Qp64a08xdzn1O_8zMQ7T5az8aU4exu8sEK-VvYdHQ";
      const response = await fetch("http://localhost:3001/api/v1/users/4/contacts", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add the contact");
      }

// added for feedback
      setFeedback("Contact added successfully! Redirecting...");
      setTimeout(() => navigate("/contacts"), 3000);


      navigate('/contacts');
    } catch (error: any) {
      console.error("Error adding contact:", error);

      // added for feedback
      // setFeedback("Error: Failed to add the contact. Please try again.");
      setFeedback(error.message);
    }
  };

  return (
    <div className= "flex min-h-screen" >
      
      <MenuBar />

     <div className="w-[50vw] mx-auto my-[2vh] p-[3vh] ">
     {/* <div className="w-[50vw] mx-auto my-[2vh] p-[3vh] "> */}
      <h1 className="text-[5vh] font-bold mb-6 text-cyan-600">Add New Contact</h1>
      {feedback && (
          <div
            className={`p-4 mb-6 rounded ${
              feedback.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {feedback}
          </div>
        )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
        
          <div>
            <label htmlFor="firstName" className="block text-gray-700 font-medium mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name is required"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-gray-700 font-medium mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name is required"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-[1vh]">
            Email
          </label>
          <input
            className="w-full px-[1vw] py-[1vh] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            type="email"
            id="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-1">
            Phone Number
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="555-555-5555"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="currentCompany" className="block text-gray-700 font-medium mb-1">
            Company
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            type="text"
            id="Company"
            name="Company"
            list="companies" // this is the id of the companies datalist
            placeholder="Type or select a company"
            value={formData.currentCompany}
            onChange={handleInputChange}
          />
          <datalist id="companies">
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="notes" className="block text-gray-700 font-medium mb-1">
            Notes
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            id="notes"
            name="notes"
            placeholder= "Add notes here"
            rows={5} 
            cols={50}
            value={formData.notes}
            onChange={handleInputChange}
            />
            </div>
          
        <div className="text-left">
          <button
            type="submit"
            // className= "bg-cyan-600 text-white px-4 py-2 rounded w-[10vw] hover:bg-cyan-700 focus:ring-cyan-500 focus:ring-2"
            className= "bg-cyan-600 text-white px-[2vw] py-[1vh] rounded w-[10vw] hover:bg-cyan-700 focus:ring-cyan-500 focus:ring-2"
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