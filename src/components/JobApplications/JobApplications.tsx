import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { fetchApplicationsData } from '../../apiCalls';


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
  company_name?: string; // Assuming this is included in your API response
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
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const userId = 1;
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJyb2xlcyI6WyJ1c2VyIl0sImV4cCI6MTczNDQ3NTk2NH0.2ioaIqAyRhtXUwOWCdvhSB2vycYj0Rkr-wiFbl0XFgA';

    const loadApplications = async () => {
      try {
        const data = await fetchApplicationsData(userId, token);
        setApplications(data);
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const filteredApplications = applications.filter((app) =>
    app.company_name
      ? app.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Applications</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="border rounded px-4 py-2 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/add-new">
          <button className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded">
            Add New +
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          {/* 
            Add CSS for loader:
            .loader {
              border-top-color: #3498db;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          */}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr className="text-left bg-gray-50 border-b">
                <th className="p-4 font-semibold text-gray-600">Company</th>
                <th className="p-4 font-semibold text-gray-600">Title</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50 border-b transition-colors duration-200"
                >
                  <td className="p-4 text-gray-700">{app.company_name || app.company_id}</td>
                  <td className="p-4 text-gray-700">{app.position_title}</td>
                  <td className="p-4">
                    <span
                      className={`py-1 px-2 rounded-md text-sm font-medium ${statusStyles[statusMap[app.status]]}`}
                    >
                      {statusMap[app.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredApplications.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="p-4 text-center text-gray-500"
                  >
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsGrid;
