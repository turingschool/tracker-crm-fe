import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { Company } from "../../Interfaces";
import { useUserLoggedContext } from "../../context/UserLoggedContext";
import { fetchCompanies } from "../../trackerApiCalls";

function Companies() {
  const [companies, setCompanies] = useState<Company[] | null>([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {token, userData} = useUserLoggedContext();

  
  useEffect(() => {
    const getCompanies = async () => {
      try {
        const companies = await fetchCompanies(userData.user.data.id, token!);
        setCompanies(companies);
        setFilteredCompanies(companies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getCompanies();
  }, [token]);

  useEffect(() => {
    if (companies) {
      setFilteredCompanies(
        companies.filter((company) =>
          company.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, companies]);

  return (
    <div className="flex min-h-screen">


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
          <Link
            to="/companies/new"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add New
          </Link>
        </div>

        {/* Companies Table */}
        {isLoading ? (
          <p data-testid="loading-message">Loading...</p>
        ) : filteredCompanies.length > 0 ? (
          <table className="table-auto w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-4 border-b">Company Name</th>
                <th className="text-left p-4 border-b">Notes</th>
              </tr>
            </thead>
            <tbody>
            {filteredCompanies.map((company) => (
              <tr 
                key={company.id} 
                className="even:bg-gray-50 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/companies/${company.id}/contacts`)}
                >
                <td className="p-4 border-b">{company.attributes.name}</td>
                <td className="p-4 border-b">{company.attributes.notes}</td>
              </tr>
            ))}
            </tbody>
          </table>
        ) : (
          <p data-testid="no-companies">No companies found</p>
        )}
      </main>
    </div>
  );
}

export default Companies