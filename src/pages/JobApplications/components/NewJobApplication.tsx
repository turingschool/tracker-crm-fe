import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserLoggedContext } from '../../../context/UserLoggedContext';
import { statusMap, statusStyles} from "../../../pages/JobApplications/components/JobApplicationUtilities";
import { fetchContacts, fetchCompanies } from "../../../constants/apiCalls";
import { BasicCompany, BasicContact } from "../../../constants/Interfaces";
import { postJobApplication } from '../../../constants/trackerApiCalls';

function NewJobApplication() {
  const navigate = useNavigate();
  const { token, userData } = useUserLoggedContext();

  const [positionTitle, setPositionTitle] = useState('');
  const [dateApplied, setDateApplied] = useState('');
  const [status, setStatus] = useState(0);
  const [notes, setNotes] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [applicationURL, setApplicationURL] = useState('');
  const [contactInformation, setContactInformation] = useState('');
  const [availableCompany, setAvailableCompany] = useState("");
  const [companies, setCompanies] = useState<BasicCompany[]>([]);
  const [contacts, setContacts] = useState<BasicContact[]>([]);

  useEffect(() => {
    const getContacts = async () => {
      if (!token || !userData?.user?.data?.id) return;

      try {
        const contacts = await fetchContacts(userData.user.data.id, token);
        const contactList = contacts.map((contact: any) => ({
          id: contact.id,
          first_name: contact.attributes.first_name,
          last_name: contact.attributes.last_name,
          company_id: contact.attributes.company_id,
        }));

        setContacts(contactList);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    getContacts();
  }, [token, userData?.user?.data?.id]);

  const filteredContacts = contacts.filter(contact => {

  return String(contact.company_id) === availableCompany;
  });


  useEffect(() => {
    const getCompanies = async () => {
      if (!token || !userData?.user?.data?.id) return;

      try {
        const companies = await fetchCompanies(userData.user.data.id, token)
        setCompanies(companies);
      } catch (error) {
        console.error("Fetch error", error);
      }
    };
    getCompanies();
  }, [userData.user.data.id, token]);

	function validateURL(url: string) {
		if (url.includes("http://") || url.includes("https://")) {
			setApplicationURL(url)
		} else {
			setApplicationURL(`http://${url}`)
		}
	}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newJobApplication: any = {
      userId: userData.user.data.id ? Number(userData.user.data.id) : undefined,
      token: userData.token,
      position_title: positionTitle,
      date_applied: dateApplied,
      status: status,
      notes: notes,
      job_description: jobDescription,
      application_url: applicationURL,
      company_id: availableCompany,
      contact_id: contactInformation || null,
    };

      postJobApplication(newJobApplication)
      .then((response) => {
        if (response) {
          navigate('/job_applications') 
        }
      }
      )
      .catch((error) => {
        console.error("Error adding job application:", error)
      })
  }

  return (
    <div className='bg-white h-screen flex'>
      <div className='flex-1 p-5'>
        <h1 className="text-[2.5vw] font-[Helvetica Neue] font-semibold text-cyan-600">Add New Application</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <div className='LEFT BLOCK'>

            {/* Position Title*/}
            <label className="text-[1vw] font-[Helvetica Neue] flex flex-col w-[90%]">
              <span className="font-semibold">Position Title:
                <span className="text-red-500"> *</span>
              </span>
              <input
                type="text"
                id="positionTitle"
                value={positionTitle}
                onChange={(e) => setPositionTitle(e.target.value)}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2"
                placeholder='Position Title (required)'
                required
              />
            </label>

            {/* Company*/}
            <label className="text-[1vw] font-[Helvetica Neue] flex flex-col w-[90%]">
              <span className="font-semibold">Company:
                <span className="text-red-500"> *</span>
              </span>
              <select
                value={availableCompany || ""}
                id="company"
                onChange={(e) => {
                  setAvailableCompany(e.target.value);
                }}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2"
                required
              >
                <option value="" className="text-gray-400">
                  Select a Company (required)
                </option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </label>
            <div className='flex flex-row' >

              {/* Date Applied */}
              <label className="text-[1vw] font-[Helvetica Neue] flex flex-col w-[45%]">
                <span className="font-semibold">Date Applied:
                  <span className="text-red-500"> *</span>
                </span>
                <input
                  type="date"
                  id="dateApplied"
                  value={dateApplied}
                  onChange={(e) => setDateApplied(e.target.value)}
                  className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2"
                  required
                />
              </label>

              {/* Status */}
              <label className="text-[1vw] font-[Helvetica Neue] flex flex-col w-[45%]">
                <span className="font-semibold">Application Status:
                  <span className="text-red-500"> *</span>
                </span>
                <select
                  value={status}
                  id="appStatus"
                  onChange={(e) => setStatus(Number(e.target.value))}
                  className={`p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2 ${statusMap[status] ? statusStyles[statusMap[status]] : ''
                    }`}
                  required                >
                  <option value="" className="text-gray-400">
                    Select Status (required)
                  </option>
                  {Object.entries(statusMap).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}                
                  </select>
              </label>
            </div>

            {/* Job Description */}
            <label className="text-[1vw] font-[Helvetica Neue] flex flex-col w-[90%]">
              <span className="font-semibold">Job Description:<span className="text-red-500"> *</span></span>
              <textarea
                value={jobDescription}
                id="jobDescription"
                onChange={(e) => setJobDescription(e.target.value)}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2  m-2"
                placeholder='Job Description (required)'
                rows={6}
                required
              />
            </label>

            {/* Contact Information */}
          <label className="text-[1vw] font-[Helvetica Neue] flex flex-col w-[90%]">
              <span className="font-semibold">Contact Information:</span>
              <select
                value={contactInformation}
                id="appContact"
                onChange={(e) => setContactInformation(e.target.value)}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2"
              >
              <option value="" className="text-gray-400">
                  Select a Contact
                </option>
                {filteredContacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.first_name} {contact.last_name}
                    </option>
                ))}
              </select>
            </label>
            <div className="text-red-500">
              <p className='m-2'>* Required Fields</p>
            </div>
          </div>

          <div className='m-2'>

            {/* Application URL */}
            <label className="text-[1vw] font-[Helvetica Neue] flex flex-col">
              <span className="font-semibold">Application URL:<span className="text-red-500"> *</span></span>
              <input
                type="url"
                id="appURL"
                value={applicationURL}
                onChange={(e) => setApplicationURL(e.target.value)}
								onBlur={() => validateURL(applicationURL)}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2 w-[90%]"
                placeholder='http://www.example.com'
              />
            </label>

            {/* Notes */}
            <label className="text-[1vw] font-[Helvetica Neue] flex flex-col">
              <span className="font-semibold">Notes:</span>
              <textarea
                value={notes}
                id="notes"
                onChange={(e) => setNotes(e.target.value)}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 w-[90%] m-2"
                rows={15}
                placeholder='Notes...'
              />
            </label>
          </div>
        <div className='pt-4 pl-2'>
          <button 
          type="submit"
          className="text-[1vw] font-[Helvetica Neue] text-white bg-cyan-600 pl-11 pr-11 p-3 rounded-md w-[25%] hover:bg-cyan-800" 
          >
            Save
            </button>
        </div>
      </form>
      </div>
    </div>
    
  )
}
export default NewJobApplication