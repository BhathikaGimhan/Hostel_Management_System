import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import UserDetailsModal from "../components/UserDetailsModal"; // Import UserDetailsModal
import ConfirmationModal from "../components/ConfirmationModal"; // Import ConfirmationModal

const Students = () => {
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null); // Store selected request for details
  const [showUserDetails, setShowUserDetails] = useState(false); // Control UserDetailsModal visibility
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Control ConfirmationModal visibility
  const [action, setAction] = useState(""); // Store the action (Approve/Remove)
  const rowsPerPage = 10;

  useEffect(() => {
    const requestsQuery = query(
      collection(db, "requests"),
      where("request", "==", "pending")
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        studentId: doc.data().studentId,
        roomId: doc.data().roomId,
        roomName: doc.data().roomName,
        phone: doc.data().phone, // Assuming phone is stored in the request
        email: doc.data().email, // Assuming email is stored in the request
        status: doc.data().request, // Adding request status
      }));
      setRequests(requestsList);
    });

    const unsubscribeRooms = onSnapshot(collection(db, "rooms"), (snapshot) => {
      const roomsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        capacity: doc.data().capacity,
        occupants: doc.data().occupants,
      }));
      setRooms(roomsList);
    });

    return () => {
      unsubscribeRequests();
      unsubscribeRooms();
    };
  }, []);

  const handleApproveRequest = async (requestId, roomId) => {
    const roomToUpdate = rooms.find((room) => room.id === roomId);

    if (roomToUpdate && roomToUpdate.occupants < roomToUpdate.capacity) {
      const updatedOccupants = roomToUpdate.occupants + 1;

      await updateDoc(doc(db, "rooms", roomId), {
        occupants: updatedOccupants,
      });
      await updateDoc(doc(db, "requests", requestId), { request: "approved" });

      alert("Request approved successfully!");
    } else {
      alert("Room is already full or not found!");
    }
  };

  const handleNotApproveRequest = (requestId) => {
    setAction("remove"); // Set action as "remove"
    setSelectedRequest(requestId);
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request); // Store selected request details
    setShowUserDetails(true); // Show UserDetailsModal
  };

  const handleConfirmAction = async () => {
    if (action === "remove") {
      await updateDoc(doc(db, "requests", selectedRequest), {
        request: "not approved",
      });
      alert("Request removed!");
    }
    setShowConfirmationModal(false); // Hide confirmation modal after action
  };

  const handleCancelAction = () => {
    setShowConfirmationModal(false); // Hide the modal if user cancels
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRequests = requests.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-[#000] mb-6">
        Students Registration
      </h2>
      <table className="min-w-full border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
              Student Name
            </th>
            <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
              NIC
            </th>
            <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
              Phone Number
            </th>
            <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
              Email
            </th>
            <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-600">
                No pending requests
              </td>
            </tr>
          ) : (
            currentRequests.map((request) => (
              <tr
                key={request.id}
                className="border-b bg-[#E6EBF0] border-[#E1E1E1]"
              >
                <td className="px-4 py-2 text-center border-gray-300">
                  {request.studentId}
                </td>
                <td className="px-4 py-2 text-center border-gray-300">
                  {request.roomName}
                </td>
                <td className="px-4 py-2 text-center border-gray-300">
                  {request.phone}
                </td>
                <td className="px-4 py-2 text-center border-gray-300">
                  {request.email}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleViewRequest(request)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    View
                  </button>
                  {request.status === "pending" && (
                    <button
                      onClick={() =>
                        handleApproveRequest(request.id, request.roomId)
                      }
                      className="bg-green-700 hover:bg-green-900 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleNotApproveRequest(request.id)}
                    className="bg-red-700 hover:bg-red-900 text-white font-bold py-1 px-2 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <div className="flex items-center space-x-2">
          {/* Left Arrow */}
          <button
            onClick={() => paginate(Math.max(currentPage - 1, 1))}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-3 rounded-l transition-colors duration-200"
            disabled={currentPage === 1}
          >
            &larr;
          </button>

          {/* Page Info */}
          <span className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold rounded">
            Page {currentPage} of {Math.ceil(requests.length / rowsPerPage)}
          </span>

          {/* Right Arrow */}
          <button
            onClick={() =>
              paginate(
                Math.min(
                  currentPage + 1,
                  Math.ceil(requests.length / rowsPerPage)
                )
              )
            }
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-3 rounded-r transition-colors duration-200"
            disabled={currentPage === Math.ceil(requests.length / rowsPerPage)}
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Modals */}
      <UserDetailsModal
        showModal={showUserDetails}
        student={selectedRequest}
        onClose={() => setShowUserDetails(false)}
      />
      <ConfirmationModal
        showModal={showConfirmationModal}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        action={action}
      />
    </div>
  );
};

export default Students;
