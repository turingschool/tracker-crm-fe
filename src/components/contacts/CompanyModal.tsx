import React from "react";
import NewCompany from "../companies/NewCompany";

type CompanyModalProps = {
  open: boolean;
};

const CompanyModal: React.FC<CompanyModalProps> = ({ open }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[50vw] relative">
        <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          &times;
        </button>
        <NewCompany />
      </div>
    </div>
  );
};

export default CompanyModal;
