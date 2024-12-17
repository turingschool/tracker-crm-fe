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
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJyb2xlcyI6WyJ1c2VyIl0sImV4cCI6MTczNDUzNTQxNn0.mzP7p1xn_irLbd2k5VtZV2wItAaFLckEJoNmMRZLf1Q";


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
    <div>
      <h1>Job Application</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {jobApp ? (
        <div>
          <h2>{jobApp.position_title}</h2>
          <p><strong>Date Applied:</strong> {new Date(jobApp.date_applied).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {jobApp.status}</p>
          <p><strong>Notes:</strong> {jobApp.notes}</p>
          <p><strong>Description:</strong> {jobApp.job_description}</p>
          <p><strong>Application URL:</strong> <a href={jobApp.application_url}>{jobApp.application_url}</a></p>
          <p><strong>Contact:</strong> {jobApp.contact_information}</p>
          <p><strong>Company Name:</strong> {jobApp.company_name}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default JobApplication