import React from "react";
import NewCompany from "../companies/NewCompany";

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
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[50vw] max-h-[80vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          X
        </button>
        <NewCompany isModal={true} onSuccess={handleNewCompany} />
      </div>
    </div>
  );
};

export default CompanyModal;
