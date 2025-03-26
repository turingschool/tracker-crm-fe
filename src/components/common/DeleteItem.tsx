import { useState } from "react";
import { DeleteItemProps } from "../../Interfaces";


const DeleteItem = ({
  userId,
  itemId,
  itemType,
  deleteAction,
  token,
  onDeleteSuccess,
}: DeleteItemProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const success = await deleteAction(userId, itemType, String(itemId), token || "");
    setDeleting(false);
    setDeleteModalOpen(false);

    if (success) {
      alert(`${itemType} deleted successfully!`);
      onDeleteSuccess();
    } else {
      alert(`Failed to delete ${itemType}. Please try again`);
    }
  };

  return (
    <>
      <button
        onClick={() => setDeleteModalOpen(true)}
        className="text-red-700 underline underline-offset-4 font-semibold "
      >
        Delete
      </button>

      {deleteModalOpen && (
        <div
          data-test="delete-modal" // Unique identifier for Cypress
          className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75"
          onClick={() => setDeleteModalOpen(false)} 
        >
          <div
            className="border-4 border-red-600 p-6 rounded shadow-lg text-red-600 text-xl text-center bg-white"
            onClick={(e) => e.stopPropagation()} 
            >
            <p className="mb-6">
              Are you sure you want to delete this {itemType.toLowerCase()}? <br /> This action is
              permanent.
            </p>
            <div className="flex justify-center text-xl">
              <button
                data-test="confirm-delete" // Unique identifier for Cypress
                onClick={handleDelete}

                className="bg-red-600 text-white px-4 py-2 rounded border border-black mr-6 w-40"

                disabled={deleting}
              >
                {deleting ? "Deleting ..." : "Delete"}
              </button>
              <button
                data-test="cancel-delete" // Unique identifier for Cypress
                onClick={() => setDeleteModalOpen(false)}

                className="bg-red-600 text-white px-4 py-2 rounded border border-black w-40"

              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteItem;
