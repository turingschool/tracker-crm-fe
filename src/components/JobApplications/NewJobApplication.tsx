import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserLoggedContext } from '../../context/UserLoggedContext';
// import {statusMap, statusStyles} from '../JobApplications'
// interface CompanyAttributes {
//   id: number;
//   name: string;
//   website: string;
//   street_address: string;
//   city: string;
//   state: string;
//   zip_code: string;
//   notes: string;
// }

// interface Company {
//   id: number;
//   type: string;
//   attributes: CompanyAttributes;
// }

interface Company {
  id: string;
  name: string;
}

function NewJobApplication() {
  const { token, userData } = useUserLoggedContext();
  const [positionTitle, setPositionTitle] = useState('');
  const [dateApplied, setDateApplied] = useState('');
  const [status, setStatus] = useState(0);
  const [notes, setNotes] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [applicationURL, setApplicationURL] = useState('');
  const [contactInformation, setContactInformation] = useState('');
  const navigate = useNavigate();
  // const [companies, setCompanies] = useState([]); 
  const [availableCompany, setAvailableCompany] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const statusMap: { [key: number]: string } = {
    1: 'Submitted',
    2: 'Interviewing',
    3: 'Offer',
    4: 'Rejected',
    5: 'Phone Screen',
  };

  const statusStyles: { [key: string]: string } = {
    Submitted: 'bg-yellow-200 text-yellow-800',
    Interviewing: 'bg-green-200 text-green-800',
    Offer: 'bg-teal-300 text-teal-900',
    Rejected: 'bg-red-200 text-red-800',
    'Phone Screen': 'bg-yellow-300 text-yellow-900',
  };

  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/users/${userData.user.data.id}/companies`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.statusText}`);
        }

        const data = await response.json();
        const companyList = data.data.map((company: any) => ({
          id: company.id,
          name: company.attributes.name,
        }));
        setCompanies(companyList);
      } catch (error) {
        console.error("Fetch error", error);
      }
    };
    fetchCompanies();
  }, [[userData.user.data.id, token]]);

  async function createJobApplication() {
    const newJobApplication = {
      job_application: {
        position_title: positionTitle,
        date_applied: dateApplied,
        status: status,
        company_id: availableCompany,
        notes: notes,
        job_description: jobDescription,
        application_url: applicationURL,
        contact_information: contactInformation
      }
    };

    try {
      // console.log("createJobApplication called");
      // console.log("user id here", userData.user.data.id);
      // console.log("token here", token);
      const response = await fetch(`http://localhost:3001/api/v1/users/${userData.user.data.id}/job_applications`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newJobApplication)
      })
      if (!response.ok) {
        throw new Error('Failed to add job application');
      }
      navigate('/job_applications')
    } catch (error) {
      console.error("Error adding job application:", error)
    }
  }

  return (
    <div className='bg-white h-screen flex'>
      <div className='flex-1 p-5'>
        <h1 className="text-[2.5vw] font-[Helvetica Neue] font-semibold text-cyan-600">Add New Application</h1>
        <form className="grid grid-cols-2 gap-4">

          <div className='LEFT BLOCK'>

            {/* Position Title*/}
            <label className="text-[1vw] font-[Helvetica Neue] flex flex-col w-[90%]">
              <span className="font-semibold">Position Title:</span>
              <input
                type="text"
                value={positionTitle}
                onChange={(e) => setPositionTitle(e.target.value)}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2"
                placeholder='Position Title is required'
                required
              />
            </label>

            {/* Company*/}

            <label className="text-[1vw] font-[Helvetica Neue] flex flex-col w-[90%]">
              <span className="font-semibold">Company:</span>
              <select
                value={availableCompany || ""}
                onChange={(e) => setAvailableCompany(e.target.value)}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2"
              >
                <option value="" className="text-gray-400">
                  Select a company (required)
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
                <span className="font-semibold">Date Applied:</span>
                <input
                  type="date"
                  value={dateApplied}
                  onChange={(e) => setDateApplied(e.target.value)}
                  className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2"
                />
              </label>

              {/* Status */}
              <label className="text-[1vw] font-[Helvetica Neue] flex flex-col w-[45%]">
                <span className="font-semibold">Application Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(Number(e.target.value))}
                  className={`p-2 border-4 rounded-lg focus:outline-none focus:ring-2 m-2 ${statusMap[status] ? statusStyles[statusMap[status]] : ''
                    }`}
                  required                >
                  <option value="" className="text-gray-400">
                    Select Status
                  </option>
                  {Object.entries(statusMap).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}                </select>
                {/* <input
                  type="number"
                  value={status}
                  onChange={(e) => setStatus(Number(e.target.value))}
                  className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2"
                  placeholder='Select status (required)'
                  required
                /> */}
              </label>
            </div>

            {/* Job Description */}
            <label className="text-[1vw] font-[Helvetica Neue] flex flex-col w-[90%]">
              <span className="font-semibold">Job Description:</span>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2  m-2"
                placeholder='Job Description is required'
                rows={6}
                required
              />
            </label>

            {/* Contact Information */}
            <label className="text-[1vw] font-[Helvetica Neue] flex flex-col w-[90%]">
              <span className="font-semibold">Contact Information:</span>
              <input
                type="text"
                value={contactInformation}
                onChange={(e) => setContactInformation(e.target.value)}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2"
                placeholder='Contact info...'
              />
            </label>
          </div>

          <div className='m-2'>

            {/* Application URL */}
            <label className="text-[1vw] font-[Helvetica Neue] flex flex-col">
              <span className="font-semibold">Application URL:</span>
              <input
                type="url"
                value={applicationURL}
                onChange={(e) => setApplicationURL(e.target.value)}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2 w-[90%]"
                placeholder='www.example.com'

              />
            </label>

            {/* Notes */}
            <label className="text-[1vw] font-[Helvetica Neue] flex flex-col">
              <span className="font-semibold">Notes:</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 w-[90%] m-2"
                rows={15}
                placeholder='Notes...'
              />
            </label>
          </div>
        </form>
        <div className='pt-4 pl-2'>
          <button className="text-[1vw] font-[Helvetica Neue] text-white bg-cyan-600 pl-11 pr-11 p-3 rounded-md w-[15%] hover:bg-cyan-800" onClick={createJobApplication}>Save</button>
        </div>
      </div>
    </div>
  )
}
export default NewJobApplication