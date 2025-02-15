import React, { useState, useEffect } from "react";
import { fetchUpdatedContact } from "../../apiCalls";
import { ContactData } from "../../Interfaces";

type EditContactModalProps = {
  open: boolean;
  setIsOpen: (value: boolean) => void;
  contact: ContactData;
  userId: number;
  token: string;
  onUpdate: (updatedContact: ContactData) => void;
};

const EditContactModal: React.FC<EditContactModalProps> = ({
  open,
  setIsOpen,
  contact,
  userId,
  token,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    firstName: contact.attributes.first_name,
    lastName: contact.attributes.last_name,
    email: contact.attributes.email || "",
    phoneNumber: contact.attributes.phone_number || "",
    notes: contact.attributes.notes || "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 

  useEffect(() => {
    setFormData({
      firstName: contact.attributes.first_name,
      lastName: contact.attributes.last_name,
      email: contact.attributes.email || "",
      phoneNumber: contact.attributes.phone_number || "",
      notes: contact.attributes.notes || "",
    });
  }, [contact]);

  if (!open) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); //
  
    const updatedContactData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      notes: formData.notes,
    };
  
    try {
      // ✅ Ensure `contact.id` is a number
      const contactIdNumber = Number(contact.id);
      if (isNaN(contactIdNumber)) throw new Error("Invalid contact ID");

      const updatedContact = await fetchUpdatedContact(userId, contactIdNumber, updatedContactData, token);
      onUpdate(updatedContact);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update contact:", error);
      setErrorMessage("Failed to update contact.");
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setIsOpen(false)}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-[40vw] max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">X</button>
        <h2 className="text-xl font-bold text-cyan-600 mb-4">Edit Contact</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
              rows={3}
            />
          </div>
          {errorMessage && (
            <p className="error text-red-600 mt-2" data-testid="error-message">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end">
            <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;
