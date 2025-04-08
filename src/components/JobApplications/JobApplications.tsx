import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApplicationsData } from '../../trackerApiCalls';
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
    <main className="flex">
      <div className="w-[76vw] pl-[6vw]">
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
            <h1 className="text-[5.5vh] font-bold text-cyan-600 tracking-wide mb-[2vh] mt-[8vh]">
              Applications
            </h1>
    
            <div className="flex justify-between items-center">
              <input
                type="search"
                placeholder="🔍 Search Applications"
                className="py-2 px-4 rounded w-[22vw] min-w-min border-2 border-slate-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />  
              <Link to="/jobapplications/new">
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white tracking-wide py-2 px-4 rounded max-w-max">
                  Add New +
                </button>
              </Link>
            </div>
            <table className="w-[70vw] mt-[1.5vh]">
              <thead className="border-t text-gray-700">
                <tr>
                  <th className="text-left p-4 border-b">Company</th>
                  <th className="text-left p-4 border-b">Title</th>
                  <th className="text-left p-4 border-b">Status</th>
                  <th className="text-left p-4 border-b">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="p-2 border-b">
                      <Link to={`/job_applications/${app.id}`}
                      className="block w-full h-full p-2">
                        {app.company_name || app.company_id}
                      </Link>
                    </td>
                    <td className="p-2 border-b">
                      <Link to={`/job_applications/${app.id}`}
                      className="block w-full h-full p-2">
                        {app.position_title}
                      </Link>
                    </td>
                    <td className="p-2 border-b">
                      <Link to={`/job_applications/${app.id}`}
                      className="block w-full h-full p-2">
                        <span
                          className={`py-2 px-6 text-sm inline-block text-center w-[10vw] min-w-[80px] max-w-[200px] 
              truncate overflow-hidden whitespace-nowrap ${statusStyles[statusMap[app.status]]}`}
                        >
                          {statusMap[app.status]}
                        </span>
                      </Link>
                    </td>
                    <td className="p-2 border-b">
                      <Link to={`/job_applications/${app.id}`}
                      className="block w-full h-full p-2">
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
          </>
        )}
      </div>
    </main>
  );
  
};

export default ApplicationsGrid;
