import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { Company } from "../../Interfaces";
import { useUserLoggedContext } from "../../context/UserLoggedContext";
import { fetchCompanies } from "../../trackerApiCalls";
import { useErrorContext } from "../../context/ErrorContext";

function Companies() {
  const [companies, setCompanies] = useState<Company[] | null>([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {token, userData} = useUserLoggedContext();
  const {setErrors, errorMessages} = useErrorContext();

  
  useEffect(() => {
    const getCompanies = async () => {
      if (token && userData?.user?.data?.id) {
        const result = await fetchCompanies(userData.user.data.id, token, setErrors);
        if (result.error) {
          console.error("Error fetching companies:", result.error);
        } else if (result.data) {
          setCompanies(result.data);
          setFilteredCompanies(result.data);
        }
      }
      setIsLoading(false);
    };
  
    getCompanies();
  }, [token, userData]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (errorMessages.length > 0) {
      timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errorMessages, setErrors]);
  
  
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

        {errorMessages.length > 0 &&
          errorMessages.map((msg, index) => (
            <p key={index} className="text-red-700 bg-red-100 p-3 rounded-md">
              {msg}
            </p>
          ))}

        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="🔍 Search Companies"
            className="py-2 px-4 rounded w-[22vw] min-w-min border-2 border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/companies/new">
            <button className="bg-cyan-600 hover:bg-cyan-500 text-white tracking-wide py-2 px-4 rounded max-w-max">
              Add New +
            </button>
          </Link>
        </div>

        {isLoading ? (
          <p data-testid="loading-message">Loading...</p>
        ) : filteredCompanies.length > 0 ? (
          <table className="w-[70vw] mt-[1.5vh] px-4">
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
                <td className="p-4 border-b text-gray-700">{company.attributes.name}</td>
                <td className="p-4 border-b max-w-[58vw] text-gray-700 truncate overflow-hidden whitespace-nowrap ">
                  {company.attributes.notes}
                </td>
              </tr>
              ))}
              </tbody>
            </table>
          ) : null }
      </div>
    </main>
  );
}

export default Companies