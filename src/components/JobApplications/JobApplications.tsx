import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApplicationsData } from '../../apiCalls';
import ClipLoader from "react-spinners/ClipLoader";
import { useUserLoggedContext } from '../../context/UserLoggedContext';
import { JobApplication } from '../../Interfaces';
import { statusMap, statusStyles} from "../JobApplicationUtilities";
import useSWR from 'swr';

const ApplicationsGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { token, userData } = useUserLoggedContext()
  const { user } = userData;
  
 
  

  const fetcher = async (): Promise<JobApplication[]> => {
    return await fetchApplicationsData(user.data.id, token!);
  };

  const { data: applications, error, isLoading } = useSWR('applications', fetcher);

  if (error) {
    return <div className="p-6 text-red-600">Error loading applications.</div>;
  }

  const filteredApplications = (applications || []).filter((app) =>
    app.company_name
      ? app.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader
            color={"#3498db"}
            loading={isLoading}
            size={60}
            aria-label="Loading Applications"
          />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Applications</h1>
  
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input
                type="search"
                placeholder="Search Company"
                className="border rounded px-4 py-2 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link to="/jobapplications/new">
              <button className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded">
                Add New +
              </button>
            </Link>
          </div>
  
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="text-left bg-gray-50 border-b">
                  <th className="p-4 font-semibold text-gray-600">Company</th>
                  <th className="p-4 font-semibold text-gray-600">Title</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                  <th className="p-4 font-semibold text-gray-600">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 border-b transition-colors duration-200"
                  >
                    <td className="p-4 text-gray-700">
                      <Link to={`/job_applications/${app.id}`}>
                        {app.company_name || app.company_id}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-700">
                      <Link to={`/job_applications/${app.id}`}>
                        {app.position_title}
                      </Link>
                    </td>
                    <td className="p-4">
                      <Link to={`/job_applications/${app.id}`}>
                        <span
                          className={`py-1 px-2 rounded-md text-sm font-medium ${statusStyles[statusMap[app.status]]}`}
                        >
                          {statusMap[app.status]}
                        </span>
                      </Link>
                    </td>
                    <td className="p-4 text-gray-700">
                      <Link to={`/job_applications/${app.id}`}>
                        {app.updated_at}
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
  
};

export default ApplicationsGrid;
