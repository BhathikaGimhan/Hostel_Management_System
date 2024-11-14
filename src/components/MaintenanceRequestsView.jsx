import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";

const MaintenanceRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsCollection = collection(db, "maintenanceRequests");
        const requestsQuery = query(
          requestsCollection,
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(requestsQuery);

        const requestsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(requestsData);
        setFilteredRequests(requestsData);
      } catch (error) {
        console.error("Error fetching requests:", error);
        alert("Failed to fetch requests.");
      }
    };

    fetchRequests();
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchEmail(searchTerm);
    const filtered = requests.filter((request) =>
      request.email ? request.email.toLowerCase().includes(searchTerm) : false
    );
    setFilteredRequests(filtered);
  };

  const handleApprove = async (id) => {
    try {
      const requestRef = doc(db, "maintenanceRequests", id);
      await updateDoc(requestRef, {
        status: "Approved",
      });
      alert("Request approved!");
      setRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: "Approved" } : request
        )
      );
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request.");
    }
  };

  const handleReject = async (id) => {
    try {
      const requestRef = doc(db, "maintenanceRequests", id);
      await updateDoc(requestRef, {
        status: "Rejected",
      });
      alert("Request rejected!");
      setRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: "Rejected" } : request
        )
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Maintenance Requests
      </h1>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={searchEmail}
          onChange={handleSearch}
          placeholder="Search by email..."
          className="p-2 border border-gray-300 rounded-lg w-full max-w-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Index Number</th>
              <th className="px-4 py-2 border-b">Phone</th>
              <th className="px-4 py-2 border-b">Room Number</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-4 py-2 border-b">{request.name}</td>
                  <td className="px-4 py-2 border-b">{request.email}</td>
                  <td className="px-4 py-2 border-b">{request.indexNumber}</td>
                  <td className="px-4 py-2 border-b">{request.phone}</td>
                  <td className="px-4 py-2 border-b">{request.room}</td>
                  <td className="px-4 py-2 border-b">{request.description}</td>
                  <td className="px-4 py-2 border-b">{request.status}</td>
                  <td className="px-4 py-2 border-b">
                    {request.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="p-2 bg-green-500 text-white rounded-lg mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="p-2 bg-red-500 text-white rounded-lg"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500">No actions</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-2 text-center">
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceRequestsTable;
