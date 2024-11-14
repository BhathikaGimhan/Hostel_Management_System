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

const Maintenance = () => {
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

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

  const handleNotApproveRequest = async (requestId) => {
    await updateDoc(doc(db, "requests", requestId), {
      request: "not approved",
    });
    alert("Request not approved!");
  };

  // Adjust rows per page based on screen height
  useEffect(() => {
    const updateRowsPerPage = () => {
      const height = window.innerHeight;
      if (height < 600) {
        setRowsPerPage(5);
      } else if (height < 800) {
        setRowsPerPage(7);
      } else {
        setRowsPerPage(10);
      }
    };

    updateRowsPerPage();
    window.addEventListener("resize", updateRowsPerPage);
    return () => window.removeEventListener("resize", updateRowsPerPage);
  }, []);

  // Calculate the requests to display for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRequests = requests.slice(indexOfFirstRow, indexOfLastRow);

  // Calculate total pages
  const totalPages = Math.ceil(requests.length / rowsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-[#000] mb-6">
        Maintenance Requests
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Student Name
              </th>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Room Number
              </th>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Phone Number
              </th>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Description
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
                  <td className="px-4 py-2 text-center border-gray-300"></td>
                  <td className="px-4 py-2 text-center border-gray-300"> </td>
                  <td className="px-4 py-2 text-center items-center justify-between">
                    <button
                      onClick={() =>
                        handleApproveRequest(request.id, request.roomId)
                      }
                      className="bg-green-700 hover:bg-green-900 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Approve
                    </button>
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
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center mt-4">
        {/* Previous Page Button */}
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
        >
          &lt;
        </button>

        {/* Page Number Buttons */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 mx-1 ${
              i + 1 === currentPage ? "bg-blue-500 text-white" : "bg-gray-300"
            } rounded`}
          >
            {i + 1}
          </button>
        ))}

        {/* Next Page Button */}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Maintenance;
