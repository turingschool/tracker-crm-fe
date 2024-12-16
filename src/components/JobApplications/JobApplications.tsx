import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

interface JobApplication {
  id: string;
  position_title: string;
  date_applied: string;
  status: number;
  notes: string;
  job_description: string;
  application_url: string;
  contact_information: string;
  company_id: number;
}

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

const ApplicationsGrid: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJyb2xlcyI6WyJ1c2VyIl0sImV4cCI6MTczNDQ3NTk2NH0.2ioaIqAyRhtXUwOWCdvhSB2vycYj0Rkr-wiFbl0XFgA';
  
        const response = await fetch('http://localhost:3001/api/v1/users/1/job_applications', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
          },
        });
        console.log("r",response)
        const result = await response.json();
        console.log("r",result)
        const formattedData = result.data.map((item: any) => ({
          id: item.id,
          ...item.attributes,
        }));
        setApplications(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchApplications();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Applications</h1>
        <Link to="/add-new">
          <button className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded">
            Add New +
          </button>
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="text-left bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Position</th>
              <th className="p-4 font-semibold text-gray-600">Date Applied</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Notes</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-gray-50 border-b transition-colors duration-200"
              >
                <td className="p-4 text-gray-700">{app.position_title}</td>
                <td className="p-4 text-gray-700">{app.date_applied}</td>
                <td className="p-4">
                  <span
                    className={`py-1 px-2 rounded-md text-sm font-medium ${statusStyles[statusMap[app.status]]}`}
                  >
                    {statusMap[app.status]}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{app.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsGrid;
