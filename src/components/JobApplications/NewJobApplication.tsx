import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserLoggedContext } from '../../context/UserLoggedContext';

function NewJobApplication() {
  const { token, userData } = useUserLoggedContext();
  const [positionTitle, setPositionTitle] = useState('');
  const [dateApplied, setDateApplied] = useState('');
  const [status, setStatus] = useState(0);
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [applicationURL, setApplicationURL] = useState('');
  const [contactInformation, setContactInformation] = useState('');
  const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState(true);

  async function createJobApplication() {
    const newJobApplication = {
      job_application: {
        position_title: positionTitle,
        date_applied: dateApplied,
        status: status,
        company_id: company,
        notes: notes,
        job_description: jobDescription,
        application_url: applicationURL,
        contact_information: contactInformation
      }
    };

    try {
      console.log("createJobApplication called");
      console.log("user id here", userData.user.data.id);
      console.log("token here", token);
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
                required
              />
            </label>

            {/* Company*/}
            <label className="text-[1vw] font-[Helvetica Neue] flex flex-col w-[90%]">
              <span className="font-semibold">Company:</span>
              <input
                type="number"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2"
                required
              />
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
                <input
                  type="number"
                  value={status}
                  onChange={(e) => setStatus(Number(e.target.value))}
                  className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2"
                  required
                />
              </label>
            </div>

            {/* Job Description */}
            <label className="text-[1vw] font-[Helvetica Neue] flex flex-col w-[90%]">
              <span className="font-semibold">Job Description:</span>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="p-2 border-4 border-slate-800 rounded-lg focus:outline-none focus:ring-2  m-2"
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