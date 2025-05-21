// import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { useUserLoggedContext } from "../../../context/UserLoggedContext";
// import { fetchCompaniesMapped, fetchNewContact } from "../../../constants/trackerApiCalls";
import { UserInformationProps } from "../../../constants/Interfaces";



const ImportContacts = ({ userData }: UserInformationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
return (
  <div> Import Contacts Page </div>
)
}
export default ImportContacts; 