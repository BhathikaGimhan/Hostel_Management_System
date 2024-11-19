import React, { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

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
    // Adjust rows per page based on window height
    const updateRowsPerPage = () => {
      const height = window.innerHeight;
      if (height < 600) {
        setRowsPerPage(4); // Fewer rows for smaller screens
      } else if (height < 800) {
        setRowsPerPage(6); // Medium rows for medium screens
      } else {
        setRowsPerPage(10); // Default to more rows for larger screens
      }
    };

    // Run on component mount and whenever the window is resized
    updateRowsPerPage();
    window.addEventListener("resize", updateRowsPerPage);

    return () => {
      window.removeEventListener("resize", updateRowsPerPage);
    };
  }, []);

  const handleDeleteRoom = async (roomId) => {
    try {
      await deleteDoc(doc(db, "rooms", roomId));
      alert("Room deleted successfully!");
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          <table className="min-w-full border-gray-300  overflow-x-auto">
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
                        onClick={() => handleDeleteRoom(room.id)}
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

        {/* Pagination Controls */}
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
    </div>
  );
};

export default ManageRooms;
