import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const MaintenanceRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All"); // Filter state for Approved, Rejected, All

  // Fetch maintenance requests from Firestore
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "maintenanceRequests")
        );
        const requestsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(requestsList);
        setFilteredRequests(requestsList); // Initially, show all requests
      } catch (error) {
        console.error("Error fetching maintenance requests: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Handle approve action
  const handleApprove = async (id) => {
    const requestRef = doc(db, "maintenanceRequests", id);
    try {
      await updateDoc(requestRef, {
        status: "Approved",
      });
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: "Approved" } : request
        )
      );
    } catch (error) {
      console.error("Error approving request: ", error);
    }
  };

  // Handle reject action
  const handleReject = async (id) => {
    const requestRef = doc(db, "maintenanceRequests", id);
    try {
      await updateDoc(requestRef, {
        status: "Rejected",
      });
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: "Rejected" } : request
        )
      );
    } catch (error) {
      console.error("Error rejecting request: ", error);
    }
  };

  // Filter requests based on the selected status
  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === "All") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(
        requests.filter((request) => request.status === selectedFilter)
      );
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-lg font-bold mb-4 text-center">
        Maintenance Requests
      </h2>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label htmlFor="status-filter" className="text-lg font-semibold mr-2">
          Filter by Status:
        </label>
        <select
          id="status-filter"
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border border-gray-400 rounded-lg"
        >
          <option value="All">All</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Room</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id} className="border-b">
              <td className="px-4 py-2">{request.name}</td>
              <td className="px-4 py-2">{request.email}</td>
              <td className="px-4 py-2">{request.room}</td>
              <td className="px-4 py-2">{request.description}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-white ${
                    request.status === "Approved"
                      ? "bg-green-500"
                      : request.status === "Rejected"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {request.status}
                </span>
              </td>
              <td className="px-4 py-2">
                {request.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500">Action taken</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceRequestsTable;
