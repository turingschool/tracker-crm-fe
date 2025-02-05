import React from "react";

type CompanyModalProps = {
  open: boolean;
};

const CompanyModal: React.FC<CompanyModalProps> = ({ open }) => {
  if (!open) return null;

  return <div>Test</div>;
};

export default CompanyModal;
