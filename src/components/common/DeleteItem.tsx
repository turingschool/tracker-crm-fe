import { useState } from "react";

//props for interface
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
// userId
// itemId
// itemType
// deleteAction
// token
// onDeleteSuccess

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
    const success = await deleteAction(userId, itemType, itemId, token);
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
        <>
          <button onClick={() => setDeleteModalOpen(false)}>x</button>
          <p>
            Are you sure you want to delete this? <br /> This action is permanent.
          </p>
          <button onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting ..." : "Ok"}
          </button>
          <button onClick={() => setDeleteModalOpen(false)}>Cancel</button>
        </>
      )}
    </>
  );
};

export default DeleteItem;
