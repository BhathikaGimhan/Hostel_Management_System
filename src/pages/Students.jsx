import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const ApproveRoomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

  useEffect(() => {
    // Adjust rows per page based on window height
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

  useEffect(() => {
    const requestsQuery = query(collection(db, "requests"));

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestsList = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          studentName: doc.data().studentName,
          studentId: doc.data().studentId,
          studentEmail: doc.data().studentEmail,
          roomId: doc.data().roomId,
          roomName: doc.data().roomName,
          status: doc.data().status,
        }))
        .filter((request) => request.status === "approved"); // Only approved requests
      setRequests(requestsList);
      setFilteredRequests(requestsList); // Initialize filtered list with approved requests
    });

    const unsubscribeRooms = onSnapshot(collection(db, "rooms"), (snapshot) => {
      const roomsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().room, // Assuming room has a name property
      }));
      setRooms(roomsList);
    });

    return () => {
      unsubscribeRequests();
      unsubscribeRooms();
    };
  }, []);

  const handleRoomFilterChange = (e) => {
    const roomId = e.target.value;
    setSelectedRoom(roomId);

    if (roomId === "all") {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter((request) => request.roomId === roomId);
      setFilteredRequests(filtered);
    }

    setCurrentPage(1); // Reset to the first page when filtering
  };

  // Calculate the requests to display for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 mb-6">
      <h2 className="text-2xl font-bold text-[#003366] mb-3">
        Approved Room Requests
      </h2>

      {/* Room Filter Dropdown */}
      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-2">
          Filter by Room:
        </label>
        <select
          value={selectedRoom}
          onChange={handleRoomFilterChange}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-2/3 md:w-1/3 text-white bg-[#003366]"
        >
          <option value="all" className="text-white bg-[#003366]">
            All Rooms
          </option>
          {rooms.map((room) => (
            <option
              className="text-white bg-[#003366]"
              key={room.id}
              value={room.id}
            >
              {room.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full">
        <div className="overflow-x-auto">
          <table className="w-full border-gray-300 overflow-x-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                  Student Name
                </th>
                <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                  Student Reg No
                </th>
                <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                  Room Name
                </th>
                <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-600">
                    No approved requests found for the selected room.
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
                      {request.studentEmail}
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

export default ApproveRoomRequests;
