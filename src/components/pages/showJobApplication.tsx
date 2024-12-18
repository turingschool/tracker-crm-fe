import { useEffect, useState } from "react"
// import { Link } from "react-router-dom";
import { showJobApp } from "../../apiCalls"

interface JobApplicationAttributes {
  position_title: string,
  date_applied: Date,
  status: number,
  notes: string,
  job_description: string,
  application_url: string,
  contact_information: string,
  company_id: number,
  company_name: string
}

interface JobApplication {
  id: number;
  type: string;
  attributes: JobApplicationAttributes;
}

function JobApplication() {
  const [jobApp, setJobApp] = useState<JobApplicationAttributes | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = 1;
  const jobAppId = 1;
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJyb2xlcyI6WyJ1c2VyIl0sImV4cCI6MTczNDYyMzI0Nn0.DQpdZR8Ko3tdFmDTTNIZnlXUImBeeqeONZOG0W-4Tlw";


  useEffect(() => {
    const fetchJobApplication = async () => {
      try {
        const data = await showJobApp(userId, jobAppId, token);
        console.log(data);
        setJobApp(data.data.attributes as JobApplicationAttributes);
        console.log(jobApp, "JOB APP")
      } catch (err) {
        console.error("Failed to fetch job application:", err);
        setError("Unable to fetch job application data.");
      };
    };
    fetchJobApplication();

  }, [])
  return(
    <body>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {jobApp ? (
        <main className="grid grid-cols-2 p-20">
          <section>
            <h1 className="text-customTeal text-5xl font-semibold ">{jobApp.position_title}</h1>
            <h2 className="text-customTeal text-3xl font-semibold">{jobApp.company_name}</h2>
            <p>Date Applied: {new Date(jobApp.date_applied).toLocaleDateString()}</p>
            <p>Status: {jobApp.status === 1 ? "Application Pending" : jobApp.status === 2 ? "Application Sent" : "Unknown Status"}</p>
            <h3 className="text-customTeal text-3xl font-semibold">Notes</h3>
            <p>{jobApp.notes}</p>
            <button className="bg-transparent border border-customTeal text-customTeal px-4 py-2 rounded">Edit</button>
          </section>
          <div className="flex flex-col gap-4">
            <section>
              <h2 className="text-customTeal text-3xl font-semibold"> Job Description</h2>
              <a 
                href={"https://www.google.com/"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 underline hover:text-blue-700"
              >
                {jobApp.application_url}
              </a>
              <p>{jobApp.job_description}</p>
            </section>
            <section>
              <h2>My contacts at {jobApp.company_name}</h2>
              <p className="text-blue-400">{jobApp.contact_information}</p>
            </section>
          </div>
        </main>
      ) : (
        <p>Loading...</p>
      )}
    </body>
  );
}

export default JobApplication