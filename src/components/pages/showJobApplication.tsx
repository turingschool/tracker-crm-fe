import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { showJobApp, updateJobApplication } from "../../trackerApiCalls";
import { useUserLoggedContext } from "../../context/UserLoggedContext";
import { statusMap, statusStyles } from "../JobApplicationUtilities";
import { deleteItem } from "../../trackerApiCalls";
import { JobApplicationContact, JobApplicationAttributes, JobApplicationDataCompile } from "../../Interfaces";
import DeleteItem from "../common/DeleteItem";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";

function JobApplication() {
  const [jobApp, setJobApp] = useState<JobApplicationAttributes | null>(null);
  const { position_title, notes, job_description, application_url, date_applied, company_id, status } = jobApp || {}
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, userData } = useUserLoggedContext();
  const { user } = userData;
  const { jobAppId } = useParams<{ jobAppId?: string }>();
  // const [status] = useState(0);
  // const [positionTitle, setPositionTitle] = useState("");
  // const [notes, setNotes] = useState("");
  // const [jobDescription, setJobDescription] = useState("");
  // const [applicationURL, setApplicationURL] = useState("");
  // const [dateApplied, setDateApplied] = useState("");
  // const [companyId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [statusUpdateFlag, setStatusUpdateFlag] = useState(false);

  const [contacts, setContacts] = useState<JobApplicationContact[]>([]);

  const navigate = useNavigate();
  const userId = userData.user.data.id;


  useEffect(() => {
    if (jobAppId) {
      const fetchJobApplication = async () => {
        try {
          const id = parseInt(jobAppId, 10);
          if (isNaN(id)) throw new Error("Invalid jobAppId.");
          const data = await showJobApp(user.data.id, id, token);

          setJobApp({
            ...data.data.attributes,
            date_applied: moment(data.data.attributes.date_applied)
              .local()
              .format("YYYY-MM-DD")
          } as JobApplicationAttributes);
          setContacts(data.data.attributes.contacts);
        } catch (err) {
          console.error("Failed to fetch job application:", err);
          setError("Unable to fetch job application data.");
        }
      };
      fetchJobApplication();
    }
  }, [jobAppId]);

  const filteredContact = contacts.filter(contact => contact.id === jobApp?.contact_id);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEdit = () => setIsEditModelOpen(true);
  const closeEdit = () => setIsEditModelOpen(false);

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement> | Date) => {
    if (event instanceof Event) {
      event.preventDefault();
    }

    setIsEditing(false);

    const compileData: JobApplicationDataCompile = {
      userId: userData.user.data.id ? Number(userData.user.data.id) : undefined,
      token: userData.token,
      id: jobAppId,
      ...jobApp
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
    if (date_applied) {
      handleSubmit()
    }
  }, [date_applied])

  useEffect(() => {
    if(statusUpdateFlag) {
      handleSubmit()
      setStatusUpdateFlag(false)
    }
  }, [status, statusUpdateFlag])
  return (
    <div className="min-h-screen mt-12 sm:p-8 sm:pt-6">
      {error && <p className="text-red-600 text-center">{error}</p>}
      {jobApp ? (
        <main className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8">
          <section>
            <h1
              className="text-cyan-600 text-[5.5vh] font-bold mb-2"
              data-testid="job-Title"
            >
              {jobApp.position_title}
            </h1>
            <Link
              className="p-0"
              to={`/companies/${company_id}/contacts`}
            >
              <h2
                className="text-[3vh] font-bold text-cyan-700 hover:text-cyan-500"
                data-testid="job-companyName"
              >
                {jobApp.company_name}
              </h2>
            </Link>
            <div className='flex flex-row items-center flex align-row mt-5 mb-4 text-lg text-gray-700 font-semibold'>
              <p id="applied-on" className="mr-2 cursor-pointer">
                Applied On: {" "}
              </p>
              {isEditing ? (
                <div className="flex flex-col">
                  <DatePicker
                    selected={new Date(date_applied as string | number | Date)}
                    onChange={(date_applied: Date | null) => {
                      if (date_applied) {
                        setJobApp({
                          ...jobApp, date_applied: moment(date_applied).format("YYYY-MM-DD")
                        });
                      }
                    }}
                    inline
                    className="font-semibold text-cyan-500 hover:text-cyan-700 cursor:pointer "
                    onClickOutside={() => setIsEditing(false)}
                    required
                  />
                </div>
              ) : (
                <span
                  className="font-semibold text-cyan-600 cursor:pointer hover:text-cyan-500"
                  data-testid="application-date"
                  onClick={() => setIsEditing(true)}
                >
                  {moment(date_applied).isValid()
                    ? moment(date_applied).format("MMMM D, YYYY")
                    : date_applied}
                </span>
              )}
            </div>
            <div className="flex flex-row items-center text-lg text-gray-700 font-semibold">
              <p id="application-status" className="mr-2">Status:</p>
                <select
                  value={status ?? 0}
                  id="appStatus"
                  onChange={(e) => {
                    setJobApp({...jobApp, status: Number(e.target.value)})
                    setStatusUpdateFlag(true)
                  }}
                  className={`py-1 px-2 m-2 border-transparent border-r-8 rounded focus:outline-none focus:ring-2  ${statusMap[status as number] ? statusStyles[statusMap[status as number]] : ''
                    }`}
                  required >
                  <option value="" className="text-gray-400">
                    Select Status
                  </option>
                  {Object.entries(statusMap).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                  ))}
                </select>
            </div>
            <h3 className="text-cyan-600 text-2xl my-4">Notes</h3>
            <p
              className={`mb-6 whitespace-pre-wrap ${jobApp.notes ? "" : "text-cyan-500"}`}
              data-testid="job-notes"
            >
              {jobApp.notes ? jobApp.notes : "Click edit to add some notes."}
            </p>
          </section>
          <section className="mt-8 lg:m-16 ">
            <div className="mb-8">

              <div className="flex justify-end" data-testid="interview-questions"> 
                <Link to={`/job_applications/${jobAppId}/interviewQuestions`} 
                  state={{
                    jobAppId: jobAppId, 
                    positionTitle: position_title, 
                    companyName: jobApp.company_name, 
                    companyId: company_id, 
                    jobDescription:job_description
                  }}>
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white tracking-wide py-2 px-4 rounded max-w-max">
                Practice Interview ✨
                </button>
                </Link>
              </div>
              <h2 className="text-cyan-700 text-2xl font-semibold sm:text-3xl mb-4">

                Job Description
              </h2>
              <a
                href={jobApp.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-cyan-600 underline hover:text-cyan-500"
                data-testid="job-URL"
              >
                {jobApp.application_url}
              </a>
              <p
                className="mt-4 text-sm  sm:text-base whitespace-pre-wrap"
                data-testid="job-description"
              >
                {jobApp.job_description.slice(0, 150)}...
              </p>
              <button
                onClick={openModal}
                className="text-cyan-600 underline hover:text-cyan-700 mt-2 block"
              >
                Read More...
              </button>
            </div>
            <div>
              <h2 className="text-cyan-700 text-xl sm:text-2xl font-semibold mb-4">
                    My Contacts at {jobApp.company_name}
              </h2>
              <ul>
                {filteredContact.length > 0 ? (
                  <Link
                  key={filteredContact[0].id}
                  to={`/contacts/${filteredContact[0].id}`}
                  className="text-cyan-600 hover:text-cyan-500 text-lg font-semibold"
                >
                  {filteredContact[0].first_name} {filteredContact[0].last_name}
                  </Link>
                ) : (
                  <Link 
                    to="/contacts/new"
                    state={{ jobApplicationId: jobAppId }}
                    >
                    <p className="text-cyan-600 font-semibold hover:text-cyan-500 underline underline-offset-8"
                    data-testid="add-new-contact"
                    >
                      Add a new contact
                    </p>
                  </Link>
                )}
              </ul>
            </div>
          </section>
          <section>
            {/* Buttons */}
            <div className="flex flex-col items-start ml-[5vw] space-y-4 sm:mt-8">
              <button
                className="border-2 border-cyan-600 text-cyan-700 px-8 py-2 rounded hover:bg-cyan-600 hover:text-white transition-all"
                onClick={openEdit}
                data-testid="edit-button"
              >
                Edit
              </button>
              {/* Code for a "Back" button that is not in the mock up */}
              {/* <Link
                className="bg-transparent border border-cyan-600 text-cyan-600 px-4 py-2 rounded inline-block text-center ml-2"
                to="/job_applications"
              >
                Back
              </Link> */}
                <div className="ml-6">
                  <DeleteItem
                    userId={userId}
                    itemId={jobAppId || ""}
                    itemType="job_application"
                    deleteAction={deleteItem}
                    token={token ?? ""}
                    onDeleteSuccess={() => navigate("/job_applications")}
                    />
                </div>
            </div>
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
                <h2 className="text-cyan-600 text-xl font-bold mb-4 whitespace-pre-wrap">
                  Full Job Description
                </h2>
                <p className="mb-4 whitespace-pre-wrap">{jobApp.job_description}</p>
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
                    value={position_title}
                    onChange={(e) => setJobApp({...jobApp, position_title: e.target.value})}
                    className="p-2 border-2 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2"
                    placeholder="Position Title"
                    data-testid="edit-modal-form-title"
                    required
                  />
                  <label>Status:</label>
                  <select
                    value={status ?? 0}
                    id="appStatus"
                    onChange={(e) => setJobApp({...jobApp, status: Number(e.target.value)})}
                    data-testid="edit-modal-form-status"
                    required
                    className={`p-2 border-2 rounded-lg focus:outline-none focus:ring-2 m-2 ${
                      statusMap[status as number] ? statusStyles[statusMap[status as number]] : ""
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
                    value={job_description}
                    id="jobDescription"
                    onChange={(e) => setJobApp({...jobApp, job_description: e.target.value})}
                    className="p-2 border-2 border-slate-800 rounded-lg focus:outline-none focus:ring-2  m-2"
                    placeholder="Job Description"
                    data-testid="edit-modal-form-description"
                    rows={6}
                  />
                  <label>URL:</label>
                  <input
                    type="url"
                    id="appURL"
                    value={application_url}
                    onChange={(e) => setJobApp({...jobApp, application_url: e.target.value})}
                    className="p-2 border-2 border-slate-800 rounded-lg focus:outline-none focus:ring-2 m-2 w-[90%]"
                    placeholder="www.example.com"
                    required
                    data-testid="edit-modal-form-url"
                  />
                  <label>Notes: </label>
                  <textarea
                    value={notes}
                    id="notes"
                    onChange={(e) => setJobApp({...jobApp, notes: e.target.value})}
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


