import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore"; // Import Firestore methods
import { db } from "../firebase/firebase"; // Firestore instance

const StudentViewPage = ({ studentId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Query requests collection where studentId matches the current student
        const q = query(
          collection(db, "requests"),
          where("studentId", "==", "aass")
        );
        const querySnapshot = await getDocs(q);
        const requestsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRequests(requestsData);
        console.log(requestsData[0].request);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [studentId]);

  if (loading) {
    return <div>Loading requests...</div>;
  }

  return (
    <div className="max-w-4xl md:ml-64 max-md:top-20 max-md:absolute mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Requests</h1>

      {requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Room</th>
              <th className="border px-4 py-2">Request Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="border px-4 py-2">{request.roomId}</td>
                <td
                  className={`border px-4 py-2 ${getStatusColor(
                    request.request
                  )}`}
                >
                  {request.request}
                </td>
                <td className="border px-4 py-2">
                  {request.request === "pending" ? (
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded">
                      Pending
                    </button>
                  ) : request.request === "approved" ? (
                    <button className="bg-green-500 text-white px-2 py-1 rounded">
                      Accepted
                    </button>
                  ) : (
                    <button className="bg-red-500 text-white px-2 py-1 rounded">
                      Rejected
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Helper function to get status color class
const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "text-green-500";
    case "rejected":
      return "text-red-500";
    case "pending":
      return "text-yellow-500";
    default:
      return "";
  }
};

export default StudentViewPage;
