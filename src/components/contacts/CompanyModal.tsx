import React from "react";
import NewCompany from "../companies/NewCompany";

type CompanyModalProps = {
  open: boolean;
};

const CompanyModal: React.FC<CompanyModalProps> = ({ open }) => {
  if (!open) return null;

  return <NewCompany></NewCompany>;
};

export default CompanyModal;
