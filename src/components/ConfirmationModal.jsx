import React from "react";

const ConfirmationModal = ({ showModal, onConfirm, onCancel, action }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-bold mb-4">
          Are you sure you want to {action} this request?
        </h3>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 py-1 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white py-1 px-4 rounded"
          >
            Yes, {action}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
