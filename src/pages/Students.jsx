import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Loading from "../components/Loading";

function StudentDashboard() {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomRequest, setRoomRequest] = useState("");
  const [message, setMessage] = useState("");
  const [roomRequests, setRoomRequests] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("userId");
    if (user) {
      const fetchData = async () => {
        try {
          setLoading(true);

          // Fetch student details
          const studentQuery = query(
            collection(db, "users"),
            where("uid", "==", user)
          );
          const studentSnapshot = await getDocs(studentQuery);
          if (!studentSnapshot.empty) {
            setStudentDetails(studentSnapshot.docs[0].data());
          }

          // Fetch maintenance requests
          const maintenanceQuery = query(
            collection(db, "maintenanceRequests"),
            where("user", "==", user)
          );
          const maintenanceSnapshot = await getDocs(maintenanceQuery);
          const requests = maintenanceSnapshot.docs.map((doc) => {
            const data = doc.data();
            const formattedDate = data.timestamp?.toDate().toLocaleString();
            return {
              id: doc.id,
              ...data,
              formattedDate,
            };
          });
          setMaintenanceRequests(requests);

          // Fetch room requests
          const roomRequestQuery = query(
            collection(db, "roomRequests"),
            where("user", "==", user)
          );
          const roomRequestSnapshot = await getDocs(roomRequestQuery);
          const roomReqs = roomRequestSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRoomRequests(roomReqs);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  const handleRoomRequestSubmit = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem("userId");
    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      setRequestLoading(true);
      await addDoc(collection(db, "roomRequests"), {
        user,
        roomRequest,
        message,
        timestamp: serverTimestamp(),
      });
      alert("Room request submitted successfully!");
      setRoomRequest("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting room request:", error);
      alert("Failed to submit room request.");
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
        Student Dashboard
      </h1>

      {/* Student Details & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {studentDetails && (
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              Student Details
            </h2>
            <p>
              <strong>Name:</strong> {studentDetails.name}
            </p>
            <p>
              <strong>Email:</strong> {studentDetails.email}
            </p>
            <p>
              <strong>Phone:</strong> {studentDetails.phone}
            </p>
            <p>
              <strong>Room Number:</strong>{" "}
              {studentDetails.roomNumber || "Not Assigned"}
            </p>
            <p>
              <strong>Index Number:</strong> {studentDetails.indexNumber}
            </p>
          </div>
        )}

        <div className="bg-gradient-to-r from-pink-100 to-pink-50 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-pink-700 mb-4">
            Maintenance Requests
          </h2>
          <p>
            <strong>Total Requests:</strong> {maintenanceRequests.length}
          </p>
          <p>
            <strong>Pending:</strong>{" "}
            {
              maintenanceRequests.filter((req) => req.status === "Pending")
                .length
            }
          </p>
          <p>
            <strong>Approved:</strong>{" "}
            {
              maintenanceRequests.filter((req) => req.status === "Approved")
                .length
            }
          </p>
          <p>
            <strong>Rejected:</strong>{" "}
            {
              maintenanceRequests.filter((req) => req.status === "Rejected")
                .length
            }
          </p>
        </div>
      </div>

      {/* Room Request Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Request Room Details
        </h2>
        <form onSubmit={handleRoomRequestSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="roomRequest"
              className="block text-sm font-medium text-gray-700"
            >
              Room Request
            </label>
            <input
              type="text"
              id="roomRequest"
              value={roomRequest}
              onChange={(e) => setRoomRequest(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Additional Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <button
            type="submit"
            disabled={requestLoading}
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {requestLoading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>

      {/* Room Requests Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Room Requests
        </h2>
        {roomRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Room</th>
                  <th className="px-4 py-2">Message</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {roomRequests.map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="px-4 py-2">{request.roomRequest}</td>
                    <td className="px-4 py-2">{request.message || "N/A"}</td>
                    <td className="px-4 py-2">
                      {request.timestamp?.toDate().toLocaleString() || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No room requests found.</p>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
