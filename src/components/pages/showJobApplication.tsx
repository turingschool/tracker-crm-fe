import { useEffect, useState } from "react"
 import { useParams } from "react-router-dom";
import { showJobApp } from "../../trackerApiCalls";

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  notes: string;
}

interface JobApplicationAttributes {
  position_title: string,
  date_applied: Date,
  status: number,
  notes: string,
  job_description: string,
  application_url: string,
  contacts: Contact[],
  company_id: number,
  company_name: string
}

function JobApplication() {
  const [jobApp, setJobApp] = useState<JobApplicationAttributes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = 1;
  const { jobAppId } = useParams<{ jobAppId?: string }>();
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJyb2xlcyI6WyJ1c2VyIl0sImV4cCI6MTczNDc4ODMyNH0.mXYSxvpXOjPKGqygPNm1ydhkBg9H7pTP3Qwss4YV_so";

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


  useEffect(() => {
    if (jobAppId) {
      const fetchJobApplication = async () => {
        try {
          const id = parseInt(jobAppId, 10);
          if (isNaN(id)) {
            throw new Error("Invalid jobAppId.");
          }
  
          const data = await showJobApp(userId, id, token);
          setJobApp(data.data.attributes as JobApplicationAttributes);
          console.log(jobApp)
        } catch (err) {
          console.error("Failed to fetch job application:", err);
          setError("Unable to fetch job application data.");
        }
      };
      fetchJobApplication();
    } else {
      console.error("jobAppId is undefined");
    }
  }, [jobAppId]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return(
    <body>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {jobApp ? (
        <main className="grid grid-cols-2 p-10">
          <section>
            <h1 className="text-cyan-600 text-5xl font-semibold mb-5">{jobApp.position_title}</h1>
            <h2 className="text-cyan-600 text-3xl font-semibold mb-12">{jobApp.company_name}</h2>
            <p className="font-semibold mb-12">Applied On {new Date(jobApp.date_applied).toLocaleDateString()}</p>
            <p>
              Status:{" "}
              <span className={`py-1 px-2 rounded ${statusStyles[statusMap[jobApp.status]]}`}>
                {statusMap[jobApp.status]}
              </span>
            </p>
            <h3 className="text-cyan-600 text-3xl font-semibold mt-12 mb-4">Notes</h3>
            <p className="mb-12">{jobApp.notes}</p>
              <button className="bg-transparent border border-customTeal text-cyan-600 px-4 py-2 ml-40 rounded">
                Edit
              </button>         
          </section>
          <div className="flex flex-col gap-4 mt-16">
            <section>
              <h2 className="text-cyan-600 text-3xl font-semibold mb-2"> Job Description</h2>
              <a 
                href={jobApp.application_url}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-500 underline hover:text-cyan-700 "
              >
                {jobApp.application_url}
              </a>
              <p className="my-2">{jobApp.job_description.slice(0, 700)}...</p>
              {/* <p className="my-2">{jobApp.job_description}</p> */}
              <button
                onClick={openModal}
                className="text-cyan-600 underline hover:text-cyan-800"
              >
                Read More
              </button>
            </section>
            <section>
              <h2 className="text-cyan-600 text-2xl font-bold">My contacts at {jobApp.company_name}</h2>
              <ul>
                {jobApp.contacts.map((contact) => (
                  <li key={contact.id}>
                    <p className="text-cyan-500 text -l font-semibold my-4">{contact.first_name} {contact.last_name}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
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
        <p>Loading...</p>
      )}
    </body>
  );
}

export default JobApplication