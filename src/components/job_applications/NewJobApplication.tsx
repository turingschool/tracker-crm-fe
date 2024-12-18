import { useState } from 'react';
import MenuBar from '../layout/MenuBar';
// import { useNavigate } from 'react-router-dom';

function NewJobApplication() {
  const [positionTitle, setPositionTitle] = useState('');
  const [dateApplied, setDateApplied] = useState('');
  const [status, setStatus] = useState(0);
  const [notes, setNotes] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [applicationURL, setApplicationURL] = useState('');
  const [contactInformation, setContactInformation] = useState('');


  return (
    <div className='bg-white h-screen flex'>
      <MenuBar />
      <div className='flex-1 p-5'>
        <h1 className="text-[2.5vw] font-[Helvetica Neue] font-semibold text-cyan-600">Add New Application</h1>
        <form className='position-right'>

          {/* Position Title*/}
          <label className="text-[1vw] font-[Helvetica Neue]">
            <span className="font-semibold">Position Title:</span>
            <input
              type="text"
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
              className="p-2 border border-black-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-800"
            />
          </label>

          {/* Company*/}
          <label className="text-[1vw] font-[Helvetica Neue]">
            <span className="font-semibold">Company:</span>
            <input
              type="number"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              className="p-2 border border-black-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-800"
            />
          </label>


          {/* Date Applied */}
          <label className="text-[1vw] font-[Helvetica Neue]">
            <span className="font-semibold">Date Applied:</span>
            <input
              type="date"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              className="p-2 border border-black-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-800"
            />
          </label>

          {/* Status */}
          <label className="text-[1vw] font-[Helvetica Neue]">
            <span className="font-semibold">Application Status:</span>
            <input
              type="number"
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="p-2 border border-black-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-800"
            />
          </label>

          {/* Notes */}
          <label className="text-[1vw] font-[Helvetica Neue]">
            <span className="font-semibold">Notes:</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="p-2 border border-black-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-800 w-full"
              rows={3}
            />
          </label>

          {/* Application URL */}
          <label className="text-[1vw] font-[Helvetica Neue]">
            <span className="font-semibold">Application URL:</span>
            <input
              type="url"
              value={applicationURL}
              onChange={(e) => setApplicationURL(e.target.value)}
              className="p-2 border border-black-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-800"
            />
          </label>

          {/* Contact Information */}
          <label className="text-[1vw] font-[Helvetica Neue]">
            <span className="font-semibold">Contact Information:</span>
            <input
              type="text"
              value={contactInformation}
              onChange={(e) => setContactInformation(e.target.value)}
              className="p-2 border border-black-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-800"
            />
          </label>

          {/* Job Description */}
          <label className="text-[1vw] font-[Helvetica Neue]">
            <span className="font-semibold">Job Description:</span>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="p-2 border border-black-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-800 w-full"
              rows={3}
            />
          </label>

        </form>
        <button className="text-[1vw] font-[Helvetica Neue] text-white bg-cyan-600 pl-11 pr-11 p-3 rounded-md">Save</button>
      </div>
    </div>
  )
}
export default NewJobApplication