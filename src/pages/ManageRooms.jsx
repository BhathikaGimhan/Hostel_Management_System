import React, { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
      const roomsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsList);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updateRowsPerPage = () => {
      const height = window.innerHeight;
      if (height < 600) {
        setRowsPerPage(4);
      } else if (height < 800) {
        setRowsPerPage(6);
      } else {
        setRowsPerPage(10);
      }
    };

    updateRowsPerPage();
    window.addEventListener("resize", updateRowsPerPage);

    return () => {
      window.removeEventListener("resize", updateRowsPerPage);
    };
  }, []);

  const handleDeleteRoom = async () => {
    if (selectedRoom) {
      try {
        await deleteDoc(doc(db, "rooms", selectedRoom.id));
        toast.success("Room deleted successfully!", { position: "top-right" });
        setShowModal(false);
        setSelectedRoom(null);
      } catch (error) {
        console.error("Error deleting room:", error);
        toast.error("Failed to delete the room.", { position: "top-right" });
      }
    }
  };

  const openDeleteModal = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(rooms.length / rowsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 mb-6">
      <h2 className="text-2xl font-bold text-[#003366] mb-3">Manage Rooms</h2>
      <div className="w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full border-gray-300 overflow-x-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                  Room Name
                </th>
                <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                  Capacity
                </th>
                <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                  Occupants
                </th>
                <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRooms.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-600">
                    No rooms available
                  </td>
                </tr>
              ) : (
                currentRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="border-b bg-[#E6EBF0] border-[#E1E1E1]"
                  >
                    <td className="text-center px-4 py-2">{room.room}</td>
                    <td className="text-center px-4 py-2">{room.capacity}</td>
                    <td className="text-center px-4 py-2">{room.occupants}</td>
                    <td className="text-center px-4 py-2">
                      <button
                        onClick={() => openDeleteModal(room)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete "{selectedRoom.room}"?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteRoom}
                className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ManageRooms;
