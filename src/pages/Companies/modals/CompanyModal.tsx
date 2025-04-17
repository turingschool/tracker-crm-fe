import React from "react";
import NewCompany from "../components/NewCompany";

type CompanyModalProps = {
  open: boolean;
  setIsOpen: (value: boolean) => void;
  onCompanyCreated: (companyId: number, companyName: string) => void;
};

const CompanyModal: React.FC<CompanyModalProps> = ({
  open,
  setIsOpen,
  onCompanyCreated,
}) => {
  if (!open) return null;

  const handleNewCompany = (newCompanyId: number, newCompanyName: string) => {
    if (onCompanyCreated) {
      onCompanyCreated(newCompanyId, newCompanyName);
    }
    setIsOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-100"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[50vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-white p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 shadow-sm"
            aria-label="Close modal"
          >
            X
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)] pr-8">
          <h2 className="text-xl font-bold text-cyan-600 mb-4">New Company</h2>
          <NewCompany isModal={true} onSuccess={handleNewCompany} />
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;
