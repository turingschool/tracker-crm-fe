import React, { useState, useEffect } from "react";
import { fetchUpdatedContact } from "../../../constants/trackerApiCalls";
import { ContactData } from "../../../constants/Interfaces";


type EditContactModalProps = {
  open: boolean;
  setIsOpen: (value: boolean) => void;
  contact: ContactData;
  userId: number;
  token: string;
  onUpdate: (updatedContact: ContactData) => void;
};

const formatContactData = (contact: ContactData) => ({
  firstName: contact.attributes.first_name,
  lastName: contact.attributes.last_name,
  email: contact.attributes.email || "",
  phoneNumber: contact.attributes.phone_number || "",
  notes: contact.attributes.notes || "",
})

const EditContactModal: React.FC<EditContactModalProps> = ({
  open,
  setIsOpen,
  contact,
  userId,
  token,
  onUpdate,
}) => {
  const [formData, setFormData] = useState(formatContactData(contact))
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 

  useEffect(() => {
    setFormData(formatContactData(contact));
  }, [contact]);
  if (!open) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      let phoneInput = value.replace(/\D/g, "");
      if (phoneInput.length > 3 && phoneInput.length <= 6) {
        phoneInput = phoneInput.slice(0, 3) + "-" + phoneInput.slice(3);
      } else if (phoneInput.length > 6) {
        phoneInput =
          phoneInput.slice(0, 3) +
          "-" +
          phoneInput.slice(3, 6) +
          "-" +
          phoneInput.slice(6, 10);
      }
      setFormData((prev) => ({
        ...prev,
        [name]: phoneInput,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value === " " ? null : value,
      }));
    }
  };
  const isPhoneValid = (phoneNumber: string) => {
    return phoneNumber === "" || /^\d{3}-\d{3}-\d{4}$/.test(phoneNumber);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); //

    if (!isPhoneValid(formData.phoneNumber)) {
      setErrorMessage("Phone number must be in the format '555-555-5555'");
      return;
    }
    const updatedContactData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      notes: formData.notes,
    };

    try {
      const contactIdNumber = Number(contact.id);
      if (isNaN(contactIdNumber)) throw new Error("Invalid contact ID");

      const updatedContact = await fetchUpdatedContact(
        userId,
        contactIdNumber,
        updatedContactData,
        token
      );
      onUpdate(updatedContact);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update contact:", error);
      setErrorMessage("Failed to update contact.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
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
          <h2 className="text-xl font-bold text-cyan-600 mb-4">Edit Contact</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                First Name <span className="text-red-600">*</span>
              </label>
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
              <label className="block text-gray-700 font-medium mb-1">
                Last Name <span className="text-red-600">*</span>
              </label>
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
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Notes
              </label>
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
              <button
                type="submit"
                className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditContactModal;