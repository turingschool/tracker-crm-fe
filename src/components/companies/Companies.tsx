// then a live search component
// an add new button (fetch call to POST)
// then a container that holds all companies (fetch to to INDEX companies)
// should have a header of company name, application status and notes
// should show all company names, application statuses and notes
import { useEffect, useState } from "react"
import MenuBar from "../layout/MenuBar";
import { Link } from "react-router-dom";

interface Company {
  id: number;
  company_name: string;
  application_status: string;
  notes: string;
}

function Companies() {
  const [companies, setCompanies] = useState<Company[] | null>(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  
  const mockCompanies = [
    { id: 1, company_name: "Company A", application_status: "Pending", notes: "Follow up next week" },
    { id: 2, company_name: "Company B", application_status: "Interview Scheduled", notes: "Prepare presentation" },
  ];

  useEffect(() => {
    setCompanies(mockCompanies);
    setFilteredCompanies(mockCompanies);
  }, []);

  useEffect(() => {
    if (companies) {
      setFilteredCompanies(
        companies.filter((company) =>
          company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, companies]);

  // useEffect(() => {
  //   const fetchCompanies = async () => {
  //     try {
  //       const response  = await fetch("http://localhost:3001/api/v1/companies", {
  //         method: "GET",
  //         headers: {
  //           // 'authorization': `Bearer ${token}
  //           // "Content-Type": "application/json"
  //         }
  //       });
  //       if (!response.ok) {
  //         throw new Error()
  //       }

  //       const data = await response.json();
  //       console.log(response)
  //       setCompanies( data as Company[] );
  //     } catch (error) {
  //         console.error('Fetch error', error)
  //     }
  //   }
  //     fetchCompanies();
  //   }, []);

  return (
    <div className="flex min-h-screen">
      
      {/* Menu Bar */}
      <MenuBar />
      
      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Companies</h1>
        
        {/* Search and Add New Button */}
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search companies..."
            className="p-2 border border-gray-300 rounded-lg w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/companies/new" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add New</Link>
        </div>

        {/* Companies Table */}
        {filteredCompanies.length > 0 ? (
          <table className="table-auto w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-4 border-b">Company Name</th>
                <th className="text-left p-4 border-b">Application Status</th>
                <th className="text-left p-4 border-b">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="even:bg-gray-50 hover:bg-gray-100">
                  <td className="p-4 border-b">{company.company_name}</td>
                  <td className="p-4 border-b">{company.application_status}</td>
                  <td className="p-4 border-b">{company.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
}

export default Companies