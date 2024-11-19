import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import Modal from "../components/Modal.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApproveRoomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    // Load data logic
    const requestsQuery = query(collection(db, "requests"));
    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        studentName: doc.data().studentName,
        studentId: doc.data().studentId,
        roomId: doc.data().roomId,
        roomName: doc.data().roomName,
        status: doc.data().status,
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

  // Pagination Logic
  const totalPages = Math.ceil(requests.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRequests = requests.slice(indexOfFirstRow, indexOfLastRow);

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const openModal = (action, request) => {
    setModalAction(action);
    setSelectedRequest(request);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalAction(null);
    setSelectedRequest(null);
  };

  const confirmAction = async () => {
    if (modalAction && selectedRequest) {
      const { id, roomId } = selectedRequest;
      if (modalAction === "approve") {
        await handleApproveRequest(id, roomId);
      } else if (modalAction === "notApprove") {
        await handleNotApproveRequest(id);
      }
    }
    closeModal();
  };

  const handleApproveRequest = async (requestId, roomId) => {
    const roomToUpdate = rooms.find((room) => room.id === roomId);

    if (roomToUpdate && roomToUpdate.occupants < roomToUpdate.capacity) {
      const updatedOccupants = roomToUpdate.occupants + 1;

      await updateDoc(doc(db, "rooms", roomId), {
        occupants: updatedOccupants,
      });
      await updateDoc(doc(db, "requests", requestId), { status: "approved" });

      toast.success("Request approved successfully!");
    } else {
      toast.error("Room is already full or not found!");
    }
  };

  const handleNotApproveRequest = async (requestId) => {
    await updateDoc(doc(db, "requests", requestId), {
      status: "not approved",
    });
    toast.warn("Request not approved!");
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-[#003366] mb-3">
          Approve Room Requests
        </h2>
        <div className="w-full">
          <div className="overflow-x-auto">
            <table className="w-full border-gray-300 overflow-x-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                    Student Name
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                    Student ID
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                    Room Name
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-600">
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
                        {request.studentName}
                      </td>
                      <td className="px-4 py-2 text-center border-gray-300">
                        {request.studentId}
                      </td>
                      <td className="px-4 py-2 text-center border-gray-300">
                        {request.roomName}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {request.status === "pending" ? (
                          <>
                            <button
                              onClick={() => openModal("approve", request)}
                              className="bg-green-700 hover:bg-green-900 text-white font-bold py-1 px-2 rounded mr-2"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openModal("notApprove", request)}
                              className="bg-red-700 hover:bg-red-900 text-white font-bold py-1 px-2 rounded"
                            >
                              Not Approve
                            </button>
                          </>
                        ) : request.status === "approved" ? (
                          <span className="text-green-700">approved</span>
                        ) : request.status === "not approved" ? (
                          <span className="text-red-700">rejected</span>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center mt-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 mx-1 ${
                  i + 1 === currentPage
                    ? "bg-[#003366] text-white"
                    : "bg-gray-300"
                } rounded`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <Modal
            title={`Confirm ${
              modalAction === "approve" ? "Approval" : "Rejection"
            }`}
            message={`Are you sure you want to ${
              modalAction === "approve" ? "approve" : "reject"
            } this request?`}
            onConfirm={confirmAction}
            onCancel={closeModal}
          />
        )}
      </div>
      <div>
        {/* Add your table and logic here */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  );
};

export default ApproveRoomRequests;
