import React from "react";

const UserDetailsModal = ({ showModal, student, onClose }) => {
  if (!showModal) return null; // Don't render if the modal is not visible

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-bold mb-4">User Details</h3>
        <p>
          <strong>Student Name:</strong> {student.studentId}
        </p>
        <p>
          <strong>Room Name:</strong> {student.roomName}
        </p>
        <p>
          <strong>Phone Number:</strong> {student.phone}
        </p>
        <p>
          <strong>Email:</strong> {student.email}
        </p>

        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 py-1 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
