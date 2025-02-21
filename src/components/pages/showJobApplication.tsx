import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { showJobApp, updateJobApplication } from "../../trackerApiCalls";
import { useUserLoggedContext } from "../../context/UserLoggedContext";
import { statusMap, statusStyles } from "../JobApplicationUtilities";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  notes: string;
}

interface JobApplicationAttributes {
  position_title: string;
  date_applied: string;
  status: number;
  notes: string;
  job_description: string;
  application_url: string;
  contacts: Contact[];
  company_id: number;
  company_name: string;
}

interface DataCompile {
  token?: string;
  userId?: number;
  id?: string;
  [key: string]: any;
}

function JobApplication() {
  const [jobApp, setJobApp] = useState<JobApplicationAttributes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, userData } = useUserLoggedContext();
  const { user } = userData;
  const { jobAppId } = useParams<{ jobAppId?: string }>();
  const [status, setStatus] = useState(0);
  const [positionTitle, setPositionTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [applicationURL, setApplicationURL] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (jobAppId) {
      const fetchJobApplication = async () => {
        try {
          const id = parseInt(jobAppId, 10);
          if (isNaN(id)) throw new Error("Invalid jobAppId.");
          const data = await showJobApp(user.data.id, id, token);

          setJobApp(data.data.attributes as JobApplicationAttributes);
          setPositionTitle(data.data.attributes.position_title);
          setStatus(data.data.attributes.status);
          setNotes(data.data.attributes.notes);
          setJobDescription(data.data.attributes.job_description);
          setApplicationURL(data.data.attributes.application_url);
          setCompanyId(data.data.attributes.company_id);
          setDateApplied(
            moment(data.data.attributes.date_applied)
              .local()
              .format("YYYY-MM-DD")
          );
        } catch (err) {
          console.error("Failed to fetch job application:", err);
          setError("Unable to fetch job application data.");
        }
      };
      fetchJobApplication();
    }
  }, [jobAppId]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEdit = () => setIsEditModelOpen(true);
  const closeEdit = () => setIsEditModelOpen(false);

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement> | Date) => {
    if (event instanceof Event) {
      event.preventDefault();
    }

    setIsEditing(false);

    const compileData: DataCompile = {
      userId: userData.user.data.id ? Number(userData.user.data.id) : undefined,
      token: userData.token,
      id: jobAppId,
      position_title: positionTitle,
      status: status,
      notes: notes,
      job_description: jobDescription,
      application_url: applicationURL,
      date_applied: dateApplied,
    };

    updateJobApplication(compileData)
      .then((updatedApplication) => {
        setJobApp(updatedApplication.data.attributes);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
    closeEdit();
  };

  useEffect(() => {
    if (dateApplied) {
      handleSubmit();
    }
  }, [dateApplied]);

  return (
    <div className="min-h-screen p-4 sm:p-8 pt-8 sm:pt-36">
      {error && <p className="text-red-600 text-center">{error}</p>}
      {jobApp ? (
        <main className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8">
          <section>
            <h1
              className="text-cyan-600 text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4"
              data-testid="job-Title"
            >
              {jobApp.position_title}
            </h1>
            <Link
              className="font-bold text-cyan-500 hover:text-cyan-700 p-0 hover:underline"
              to={`/companies/${companyId}/contacts`}
            >
              <h2
                className="text-[3.5vh] font-bold text-cyan-500 hover:text-cyan-700 p-0 hover:underline"
                data-testid="job-companyName"
              >
                {jobApp.company_name}
              </h2>
            </Link>
            <div className="flex align-row mt-5">
              <p className="font-bold mb-4 mr-2">Applied On: </p>
              {isEditing ? (
                <div className="flex flex-col">
                  <DatePicker
                    selected={new Date(dateApplied)}
                    onChange={(dateApplied: Date | null) => {
                      if (dateApplied) {
                        setDateApplied(
                          moment(dateApplied).format("YYYY-MM-DD")
                        );
                      }
                    }}
                    inline
                    className="font-bold text-cyan-500 hover:text-cyan-700 p-0 hover:underline cursor:pointer"
                    onClickOutside={() => setIsEditing(false)}
                    required
                  />
                </div>
              ) : (
                <span
                  className="font-bold text-cyan-500 hover:text-cyan-700 p-0 hover:underline cursor:pointer"
                  data-testid="application-date"
                  onClick={() => setIsEditing(true)}
                >
                  {moment(dateApplied).isValid()
                    ? moment(dateApplied).format("MMMM D, YYYY")
                    : dateApplied}
                </span>
              )}
            </div>
            <div className="flex-row">
              <p className="mb-6 font-bold">
                Status:{" "}
                <span
                  className={`py-1 px-2 rounded ${
                    statusStyles[statusMap[jobApp.status]]
                  }`}
                  data-testid="job-status"
                >
                  {statusMap[jobApp.status]}
                </span>
              </p>
            </div>
            <h3 className="text-cyan-600 text-2xl mb-4">Notes</h3>
            <p
              className={`mb-8 ${jobApp.notes ? "" : "text-cyan-500"}`}
              data-testid="job-notes"
            >
              {jobApp.notes ? jobApp.notes : "Click edit to add some notes."}
            </p>
            <button
              className="bg-transparent border border-cyan-600 text-cyan-600 px-4 py-2 rounded"
              onClick={openEdit}
              data-testid="edit-button"
            >
              Edit
            </button>
            <Link
              className="bg-transparent border border-cyan-600 text-cyan-600 px-4 py-2 rounded inline-block text-center ml-2"
              to="/job_applications"
            >
              Back
            </Link>
          </section>

          <section className="mt-8 lg:mt-0">
            <div className="mb-8">
              <div className="flex justify-end"> 
                <Link to={`/job_applications/${jobAppId}/interviewQuestions`} state={{positionTitle: positionTitle, companyName: jobApp.company_name, jobDescription:jobDescription}}>
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white tracking-wide py-2 px-4 rounded max-w-max">
                Practice Interview ✨
                </button>
                </Link>
              </div>
              <h2 className="text-cyan-600 text-2xl sm:text-3xl mb-4">
                Job Description
              </h2>
              <a
                href={jobApp.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-500 underline hover:text-cyan-700"
                data-testid="job-URL"
              >
                {jobApp.application_url}
              </a>
              <p
                className="mt-4 text-sm sm:text-base"
                data-testid="job-description"
              >
                {jobApp.job_description.slice(0, 300)}...
              </p>
              <button
                onClick={openModal}
                className="text-cyan-600 underline hover:text-cyan-800 mt-2 block"
              >
                Read More...
              </button>
            </div>
            {/**WORKING CODE CAN BE USED TO RESOLVE ISSUE 93**
            /* <div>
              <h2 className="text-cyan-600 text-xl sm:text-2xl font-bold mb-4">
                My Contacts at {jobApp.company_name}
              </h2>
              <ul>
                {jobApp.contacts.length > 0 ? (
                  jobApp.contacts.map((contact) => (
                    <li key={contact.id} className="mb-4">
                      <p className="text-cyan-500 font-semibold">
                        {contact.first_name} {contact.last_name}
                      </p>
                    </li>
                  ))
                  ) : (
                    <Link to="/contacts/new">
                      <p className="text-cyan-500 underline font-semibold hover:text-cyan-600">
                        Add a new contact
                      </p>
                    </Link>
                  )
                }
              </ul>
            </div> */}
          </section>

          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={closeModal}
            >
              <div
                className="bg-white rounded p-6 w-3/4 max-w-lg max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-cyan-600 text-xl font-bold mb-4">
                  Full Job Description
                </h2>
                <p className="mb-4">{jobApp.job_description}</p>
                <button
                  onClick={closeModal}
                  className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-800"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {isEditModelOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              data-testid="edit-modal"
            >
              <div className="bg-white rounded p-6 w-3/4 max-w-lg max-h-[80vh] overflow-y-auto">
                <h2
                  className="text-cyan-600 text-xl font-bold mb-4"
                  data-testid="edit-modal-title"
                >
                  Update Job Description
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-2 gap-4"
                  data-testid="edit-modal-form"
                >
                  <label>Position Title:</label>
                  <input
                    type="text"
                    id="positionTitle"
                    value={positionTitle}
                    onChange={(e) => setPositionTitle(e.target.value)}
                    className="p-2 border-2 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2"
                    placeholder="Position Title"
                    data-testid="edit-modal-form-title"
                    required
                  />
                  <label>Status:</label>
                  <select
                    value={status}
                    id="appStatus"
                    onChange={(e) => setStatus(Number(e.target.value))}
                    data-testid="edit-modal-form-status"
                    required
                    className={`p-2 border-2 rounded-lg focus:outline-none focus:ring-2 m-2 ${
                      statusMap[status] ? statusStyles[statusMap[status]] : ""
                    }`}
                  >
                    <option value="" className="text-gray-400">
                      Select Status
                    </option>
                    {Object.entries(statusMap).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <label>Job Description:</label>
                  <textarea
                    value={jobDescription}
                    id="jobDescription"
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="p-2 border-2 border-slate-800 rounded-lg focus:outline-none focus:ring-2  m-2"
                    placeholder="Job Description"
                    data-testid="edit-modal-form-description"
                    rows={6}
                  />
                  <label>URL:</label>
                  <input
                    type="url"
                    id="appURL"
                    value={applicationURL}
                    onChange={(e) => setApplicationURL(e.target.value)}
                    className="p-2 border-2 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2 w-[90%]"
                    placeholder="www.example.com"
                    required
                    data-testid="edit-modal-form-url"
                  />
                  <label>Notes: </label>
                  <textarea
                    value={notes}
                    id="notes"
                    onChange={(e) => setNotes(e.target.value)}
                    className="p-2 border-2 border-slate-800 rounded-lg focus:outline-none focus:ring-2 w-[90%] m-2"
                    rows={6}
                    placeholder="Notes..."
                    data-testid="edit-modal-form-notes"
                  />
                  <button
                    onClick={closeEdit}
                    className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-800"
                    data-testid="edit-modal-form-cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-800"
                    data-testid="edit-modal-form-submit-button"
                  >
                    Update Info
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </div>
  );
}

export default JobApplication;
