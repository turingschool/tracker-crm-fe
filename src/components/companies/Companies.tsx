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
    <main className="flex">
      <div className="w-[76vw] pl-[6vw]">
        <h1 className="text-[5.5vh] font-bold text-cyan-600 tracking-wide mb-[2vh] mt-[8vh]">
          Companies
        </h1>

        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="🔍 Search Companies"
            className="py-2 px-4 rounded w-[22vw] min-w-min border-2 border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/companies/new">
            <button className="bg-cyan-600">
            Add New +
            </button>
          </Link>
        </div>

        {isLoading ? (
          <p data-testid="loading-message">Loading...</p>
        ) : filteredCompanies.length > 0 ? (
          <table className="w-[70vw] mt-[1.5vh]">
            <thead className="border-t">
              <tr>
                <th className="text-left p-4 border-b">Name</th>
                <th className="text-left p-4 border-b">Notes</th>
              </tr>
            </thead>
            <tbody>
            {filteredCompanies.map((company) => (
              <tr 
                key={company.id} 
                className="hover:bg-gray-100 cursor-pointer"
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
      </div>
    </main>
  );
}

export default Companies