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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

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

  useEffect(() => {
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
      console.log(requestsList);
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
      await updateDoc(doc(db, "requests", requestId), { status: "approved" });

      alert("Request approved successfully!");
    } else {
      alert("Room is already full or not found!");
    }
  };

  const handleNotApproveRequest = async (requestId) => {
    await updateDoc(doc(db, "requests", requestId), {
      status: "not approved",
    });
    console.log(requestId);
    alert("Request not approved!");
  };

  // Calculate the requests to display for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRequests = requests.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(requests.length / rowsPerPage);

  // Go to specific page
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 mb-6">
      <h2 className="text-2xl font-bold text-[#003366] mb-3">
        Approve Room Requests
      </h2>
      <div className="w-full">
        <div className="overflow-x-auto ">
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

        {/* Pagination Controls */}
        <div className="flex justify-end items-center mt-4 ">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50 -z-0"
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
            className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50 -z-0"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveRoomRequests;
