import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { showJobApp } from "../../trackerApiCalls";
import { useUserLoggedContext } from "../../context/UserLoggedContext";

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
  date_applied: Date;
  status: number;
  notes: string;
  job_description: string;
  application_url: string;
  contacts: Contact[];
  company_id: number;
  company_name: string;
}

function JobApplication() {
  const [jobApp, setJobApp] = useState<JobApplicationAttributes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, userData } = useUserLoggedContext();
  const { user } = userData;
  const { jobAppId } = useParams<{ jobAppId?: string }>();

  const statusMap: { [key: number]: string } = {
    1: 'Submitted',
    2: 'Interviewing',
    3: 'Offer',
    4: 'Rejected',
    5: 'Phone Screen',
    6: 'Code Challenge',
    7: 'Not Yet Applied',
  };


  const statusStyles: { [key: string]: string } = {
    Submitted: "bg-yellow-200 text-yellow-800",
    Interviewing: "bg-green-200 text-green-800",
    Offer: "bg-teal-300 text-teal-900",
    Rejected: "bg-red-200 text-red-800",
    "Phone Screen": "bg-yellow-300 text-yellow-900",
  };

  useEffect(() => {
    if (jobAppId) {
      const fetchJobApplication = async () => {
        try {
          const id = parseInt(jobAppId, 10);
          if (isNaN(id)) throw new Error("Invalid jobAppId.");
          const data = await showJobApp(user.data.id, id, token);
          setJobApp(data.data.attributes as JobApplicationAttributes);
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

  return (
    <div className="min-h-screen p-4 sm:p-8 pt-8 sm:pt-36">
      {error && <p className="text-red-600 text-center">{error}</p>}
      {jobApp ? (
        <main className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8">
          <section>
            <h1 className="text-cyan-600 text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4">
              {jobApp.position_title}
            </h1>
            <h2 className="text-cyan-600 text-2xl sm:text-3xl mb-6">{/* REFACTOR AWAITING SHOW COMPANY ROUTE */}
              {jobApp.company_name}
            </h2>
            <p className="font-medium mb-4">{/* REFACTOR AWAITING UPDATE JOB APP ROUTE */}
              Applied On:{" "}
              <span className="font-semibold">
                {new Date(jobApp.date_applied).toLocaleDateString()}
              </span>
            </p>
            <p className="mb-6">{/* REFACTOR AWAITING UPDATE JOB APP ROUTE */}
              Status:{" "}
              <span className={`py-1 px-2 rounded ${statusStyles[statusMap[jobApp.status]]}`} >
                {statusMap[jobApp.status]}
              </span>
            </p>
            <h3 className="text-cyan-600 text-2xl mb-4">Notes</h3>
            <p className={`mb-8 ${jobApp.notes ? "" : "text-cyan-500"}`}>
              {jobApp.notes ? jobApp.notes : "Click edit to add some notes."}
            </p>
            <button className="bg-transparent border border-cyan-600 text-cyan-600 px-4 py-2 rounded">{/* REFACTOR AWAITING UPDATE JOB APP ROUTE */}
              Edit
            </button>
          </section>

          <section className="mt-8 lg:mt-0">
            <div className="mb-8">
              <h2 className="text-cyan-600 text-2xl sm:text-3xl mb-4">
                Job Description
              </h2>
              <a
                href={jobApp.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-500 underline hover:text-cyan-700"
              >
                {jobApp.application_url}
              </a>
              <p className="mt-4 text-sm sm:text-base">
                {jobApp.job_description.slice(0, 300)}...
              </p>
              <button
                onClick={openModal}
                className="text-cyan-600 underline hover:text-cyan-800 mt-2 block"
              >
                Read More...
              </button>
            </div>
            <div>
              <h2 className="text-cyan-600 text-xl sm:text-2xl font-bold mb-4">
                My Contacts at {jobApp.company_name}
              </h2>
              <ul>
                {jobApp.contacts.length > 0 ? (
                  jobApp.contacts.map((contact) => (
                    <li key={contact.id} className="mb-4">{/* REFACTOR AWAITING CONTACT SHOW ROUTE */}
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
            </div>
          </section>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded p-6 w-3/4 max-w-lg max-h-[80vh] overflow-y-auto">
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
        </main>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </div>
  );
}

export default JobApplication;