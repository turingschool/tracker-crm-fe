// then a live search component
// an add new button (fetch call to POST)
// then a container that holds all companies (fetch to to INDEX companies)
// should have a header of company name, application status and notes
// should show all company names, application statuses and notes
import { useEffect, useState } from "react"


function Companies() {
  const [companies, setCompanies] = useState(null)
  
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response  = await fetch("http://localhost:3001/api/v1/companies", {
          method: "GET",
          headers: {
            // 'authorization': `Bearer ${token}
            // "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error()
        }

        const data = await response.json();
        console.log(response)
        setCompanies(data);
      } catch (error) {
          console.error('Fetch error', error)
      }
    }
      fetchCompanies();
    }, []);



  
  return (
    <main className="companies-main">
      <h1 className="companies-header">Companies</h1>
      {companies && (
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Application Status</th>
              <th>Notes</th>
            </tr>
            
          </thead>
        </table>

      )}
    </main>
  )
}

export default Companies