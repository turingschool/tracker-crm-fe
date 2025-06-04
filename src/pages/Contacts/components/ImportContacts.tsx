import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FormInputData } from "../../../constants/Interfaces";
import { fetchNewImportedContacts } from "../../../constants/trackerApiCalls";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { UserInformationProps } from "../../../constants/Interfaces";

type ContactCSVRow = {
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  notes?: string;
  company_id?: string;
};

const requiredFields = ["first_name", "last_name"];

const ImportContacts = ({ userData }: UserInformationProps) => {

  const [parsedContacts, setParsedContacts] = useState<ContactCSVRow[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setFeedback("File too large. Please keep under 1MB.");
      return;
    }

    Papa.parse<ContactCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) =>
        header.trim().toLowerCase().replace(/\s+/g, "_"),
      complete: (results) => {
        const headers = results.meta.fields || [];

        const missing = requiredFields.filter((field) => !headers.includes(field));
        if (missing.length > 0) {
          setFeedback(`Missing required fields: ${missing.join(", ")}`);
          return;
        }

        setParsedContacts(results.data);
        setFeedback(`Successfully parsed ${results.data.length} contacts.`);
      },
      error: (err) => {
        setFeedback("Error parsing CSV: " + err.message);
      },
    });
  }, []);
  const navigate = useNavigate();
  const handleConfirmImport = async () => {
    
    if (!userData?.user?.data?.id || !userData.token) {
      setFeedback("Missing user information.");
      return;
    }
    try {
      const userId = Number(userData.user.data.id);
      const token = userData.token;

       for (const contact of parsedContacts) {
      const contactFormInput: FormInputData = {
        firstName: contact.first_name,
        lastName: contact.last_name,
        email: contact.email || "",
        phoneNumber: contact.phone_number || "",
        companyId: contact.company_id ? Number(contact.company_id) : null,
        notes: contact.notes || "",
      };

      const backendContact = {
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email || "",
        phone_number: contact.phone_number || "",
        notes: contact.notes || "",
        company_id: contact.company_id ? Number(contact.company_id) : null,
      };
        await fetchNewImportedContacts(userId, token, contactFormInput, backendContact);
      }
      navigate("/contacts", {state: {importSuccess: true } });
    } catch (error) {
      console.error("Error adding contacts:", error);
      navigate("/contacts", {state: {importSuccess: false }})
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-[50vw] mx-auto my-[2vh] p-[3vh]">
        <h1 className="text-[5vh] font-bold mb-6 text-cyan-600">
          Import Contacts
        </h1>

        {feedback && (
          <div
            className={`p-4 mb-6 rounded ${
              feedback.startsWith("Successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {feedback}
          </div>
        )}

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-10 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-cyan-500 bg-cyan-50"
              : "border-gray-300 bg-white"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-700">
            {isDragActive
              ? "Drop the CSV file here..."
              : "Drag & drop a CSV file here, or click to select"}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Required columns: <code>first_name</code>, <code>last_name</code>
            <div></div>Optional columns (if used, must be named exactly): <code>email</code>, <code>phone_number</code>, <code>notes</code>, <code>company_id</code>
          </p>
        </div>

        {parsedContacts.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-cyan-600">
              Preview ({parsedContacts.length} contacts)
            </h2>
            <div className="max-h-[30vh] overflow-y-auto border rounded-md p-3">
              <table className="w-full text-sm text-left border-collapse">
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleConfirmImport}
                    className="bg-green-600 test-white px-4 py2 rounded hover:bg-green-700"
                    >
                      Confirm and Add Contacts
                    </button>
                    <button
                      onClick={() => {
                        setParsedContacts([]);
                        setFeedback(null);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                  </div>
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(parsedContacts[0]).map((key) => (
                      <th key={key} className="px-2 py-1 border-b text-gray-700">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedContacts.map((contact, index) => (
                    <tr key={index} className="odd:bg-white even:bg-gray-50">
                      {Object.values(contact).map((value, i) => (
                        <td key={i} className="px-2 py-1 border-b">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportContacts;
