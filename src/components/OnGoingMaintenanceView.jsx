import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OnGoingMaintenanceView = ({ userRole, userId }) => {
  const [ongoingMaintenance, setOngoingMaintenance] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOngoingMaintenance = async () => {
    try {
      setLoading(true);
      let maintenanceQuery;
      if (userRole === "student") {
        maintenanceQuery = query(
          collection(db, "ongoingMaintenance"),
          where("user", "==", userId)
        );
      } else {
        maintenanceQuery = collection(db, "ongoingMaintenance");
      }

      const querySnapshot = await getDocs(maintenanceQuery);
      const maintenanceList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOngoingMaintenance(maintenanceList);
    } catch (error) {
      console.error("Error fetching ongoing maintenance: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const roomsCollection = await getDocs(collection(db, "rooms"));
      const roomsList = roomsCollection.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().room,
      }));
      setRooms(roomsList);
    } catch (error) {
      console.error("Error fetching rooms: ", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "ongoingMaintenance", id), {
        status: newStatus,
      });
      toast.success(`Status updated to ${newStatus}!`);
      await fetchOngoingMaintenance(); // Refresh data
    } catch (error) {
      console.error("Error updating status: ", error);
      toast.error("Failed to update status!");
    }
  };

  useEffect(() => {
    fetchOngoingMaintenance();
    fetchRooms();
  }, [userId, userRole]);

  const handleRoomFilterChange = (e) => {
    setSelectedRoom(e.target.value);
    setCurrentPage(1); // Reset pagination when filter changes
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const filteredMaintenance = ongoingMaintenance.filter((maintenance) => {
    const room = rooms.find((r) => r.id === selectedRoom);
    return selectedRoom === "all" || maintenance.room === room?.name;
  });

  const paginatedMaintenance = filteredMaintenance.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMaintenance.length / itemsPerPage);

  if (loading) return <div>Loading ongoing maintenance...</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4 text-center">
        Ongoing Maintenance
      </h2>

      {userRole === "admin" && (
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
      )}
      {/* Maintenance Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Name
              </th>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Room
              </th>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Description
              </th>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Status
              </th>
              {userRole === "student" && (
                <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedMaintenance.map((maintenance) => (
              <tr
                key={maintenance.id}
                className="border-b bg-[#E6EBF0] border-[#E1E1E1]"
              >
                <td className="text-center px-4 py-2">{maintenance.name}</td>
                <td className="text-center px-4 py-2">{maintenance.room}</td>
                <td className="text-center px-4 py-2">
                  {maintenance.description}
                </td>
                <td className="text-center px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      maintenance.status === "Fixed"
                        ? "bg-green-700"
                        : maintenance.status === "Not Fixed"
                        ? "bg-red-700"
                        : "bg-yellow-600"
                    }`}
                  >
                    {maintenance.status}
                  </span>
                </td>
                {userRole === "student" && (
                  <td className="text-center px-4 py-2">
                    {maintenance.status !== "Fixed" &&
                    maintenance.status !== "Not Fixed" ? (
                      <>
                        <button
                          onClick={() => {
                            updateStatus(maintenance.id, "Fixed");
                          }}
                          className="bg-green-700 text-white px-4 py-2 rounded-lg mr-2"
                          disabled={maintenance.status === "Fixed"}
                        >
                          Mark as Fixed
                        </button>
                        <button
                          onClick={() => {
                            updateStatus(maintenance.id, "Not Fixed");
                          }}
                          className="bg-red-700 text-white px-4 py-2 rounded-lg"
                          disabled={maintenance.status === "Not Fixed"}
                        >
                          Mark as Not Fixed
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-700 font-semibold">
                        Action Taken
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
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
              i + 1 === currentPage ? "bg-[#003366] text-white" : "bg-gray-300"
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
  );
};

export default OnGoingMaintenanceView;
