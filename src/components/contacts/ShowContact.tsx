import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuBar from "../layout/MenuBar";

interface ContactData {
  "id": string,
  "type": string,
  "attributes": {
      "first_name": string,
      "last_name": string,
      "company_id": number,
      "email": string,
      "phone_number": string,
      "notes": string,
      "user_id": number
  }
};

function ShowContact() {

  return (
    
  )
}