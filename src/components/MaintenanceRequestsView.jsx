import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const MaintenanceRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
        setFilteredRequests(requestsList);
      } catch (error) {
        console.error("Error fetching maintenance requests: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    const requestRef = doc(db, "maintenanceRequests", id);
    try {
      await updateDoc(requestRef, { status: "Approved" });
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: "Approved" } : request
        )
      );
    } catch (error) {
      console.error("Error approving request: ", error);
    }
  };

  const handleReject = async (id) => {
    const requestRef = doc(db, "maintenanceRequests", id);
    try {
      await updateDoc(requestRef, { status: "Rejected" });
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: "Rejected" } : request
        )
      );
    } catch (error) {
      console.error("Error rejecting request: ", error);
    }
  };

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
    setCurrentPage(1);
  };

  useEffect(() => {
    const updateRowsPerPage = () => {
      const height = window.innerHeight;
      setRowsPerPage(height < 600 ? 5 : height < 800 ? 7 : 10);
    };
    updateRowsPerPage();
    window.addEventListener("resize", updateRowsPerPage);
    return () => window.removeEventListener("resize", updateRowsPerPage);
  }, []);

  const indexOfLastRequest = currentPage * rowsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - rowsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);

  const goToPage = (page) => setCurrentPage(page);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-lg font-bold mb-4 text-center">
        Maintenance Requests
      </h2>

      <div className="mb-4 flex items-center">
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
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Name
              </th>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Email
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
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request) => (
              <tr
                key={request.id}
                className="border-b bg-[#E6EBF0] border-[#E1E1E1]"
              >
                <td className="text-center px-4 py-2">{request.name}</td>
                <td className="text-center px-4 py-2">{request.email}</td>
                <td className="text-center px-4 py-2">{request.room}</td>
                <td className="text-center px-4 py-2">{request.description}</td>
                <td className="text-center px-4 py-2">
                  <span
                    className={`text-center px-2 py-1 rounded-full text-white ${
                      request.status === "Approved"
                        ? "bg-green-700"
                        : request.status === "Rejected"
                        ? "bg-red-700"
                        : "bg-yellow-600"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="text-center px-4 py-2">
                  {request.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-700 text-white px-4 py-2 rounded-lg mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-700">Action taken</span>
                  )}
                </td>
              </tr>
            ))}
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
              i + 1 === currentPage ? "bg-blue-500 text-white" : "bg-gray-300"
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
  );
};

export default MaintenanceRequestsTable;
