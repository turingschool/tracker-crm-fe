import { useState } from "react";

interface DeleteItemProps {
  userId: number;
  itemId: string | number;
  itemType: string;
  deleteAction: (
    userId: number,
    itemType: string,
    itemId: string | number,
    token: string
  ) => Promise<boolean>;
  token: string;
  onDeleteSuccess: () => void;
}

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
        className="text-red-600 underline text-sm"
      >
        Delete
      </button>

      {deleteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75" onClick={() => setDeleteModalOpen(false)}>
        <div className="border-4 border-red-600 p-6 rounded shadow-lg text-red-600 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="mb-6">
              Are you sure you want to delete this? <br /> This action is
              permanent.
            </p>
            <button
              onClick={handleDelete}
              className="bg-gray-200 text-red-600 px-4 py-2 rounded border border-black mr-2"
              disabled={deleting}
            >
              {deleting ? "Deleting ..." : "Ok"}
            </button>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="bg-gray-200 text-red-600 px-4 py-2 rounded border border-black"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteItem;
