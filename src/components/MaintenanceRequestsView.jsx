import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import Modal from "../components/Modal.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MaintenanceRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "maintenanceRequests")
      );
      const requestsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort the requests so that 'Pending' is on top
      const sortedRequests = requestsList.sort((a, b) => {
        if (a.status === "Pending" && b.status !== "Pending") {
          return -1; // 'Pending' should come first
        }
        if (a.status !== "Pending" && b.status === "Pending") {
          return 1; // 'Pending' should come first
        }
        return 0; // Keep other statuses in their current order
      });

      setRequests(sortedRequests);
      setFilteredRequests(
        filter === "All"
          ? sortedRequests
          : sortedRequests.filter((req) => req.status === filter)
      );
    } catch (error) {
      console.error("Error fetching maintenance requests: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

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
      const { id } = selectedRequest;
      if (modalAction === "approve") {
        await handleApprove(id);
      } else if (modalAction === "reject") {
        await handleReject(id);
      }
    }
    closeModal();
  };

  const handleApprove = async (id) => {
    try {
      // Update status in the current collection
      await updateDoc(doc(db, "maintenanceRequests", id), {
        status: "Approved",
      });

      // Get the approved request's details
      const requestDoc = await getDoc(doc(db, "maintenanceRequests", id));
      const requestData = requestDoc.data();

      // Add to ongoingMaintenance collection
      await addDoc(collection(db, "ongoingMaintenance"), {
        ...requestData,
        status: "Pending", // Initial stage
        approvedAt: new Date(),
      });

      toast.success("Request approved and added to ongoing maintenance!");
      await fetchRequests(); // Refresh the table
    } catch (error) {
      console.error("Error approving request: ", error);
      toast.error("Failed to approve request!");
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, "maintenanceRequests", id), {
        status: "Rejected",
      });
      toast.warn("Request rejected!");
      await fetchRequests(); // Refresh the table
    } catch (error) {
      console.error("Error rejecting request: ", error);
      toast.error("Failed to reject request!");
    }
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    setFilteredRequests(
      selectedFilter === "All"
        ? requests
        : requests.filter((req) => req.status === selectedFilter)
    );
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
                        onClick={() => openModal("approve", request)}
                        className="bg-green-700 text-white px-4 py-2 rounded-lg mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openModal("reject", request)}
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

export default MaintenanceRequestsTable;
