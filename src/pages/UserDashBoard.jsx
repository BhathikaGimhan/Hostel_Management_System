import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase"; // Firebase instance
import { collection, query, where, getDocs } from "firebase/firestore";
import Loading from "../components/Loading";

function StudentDashboard() {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [roomRequest, setRoomRequest] = useState(null);
  const [reqLength, setReqLength] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("userId"); // Fetch user ID from localStorage
    console.log(user);
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
            // Convert Firestore Timestamp to a readable date
            const formattedDate = data.timestamp?.toDate().toLocaleString();
            return {
              id: doc.id,
              ...data,
              formattedDate,
            };
          });
          setMaintenanceRequests(requests);

          // Fetch room request data
          const roomRequestQuery = query(
            collection(db, "requests"),
            where("uid", "==", user)
          );
          const roomRequestSnapshot = await getDocs(roomRequestQuery);
          if (!roomRequestSnapshot.empty) {
            setReqLength(roomRequestSnapshot.size);
            const requestData = roomRequestSnapshot.docs[0].data();
            setRoomRequest({
              ...requestData,
              timestamp: requestData.timestamp?.toDate().toLocaleString(),
            });
          } else {
            setRoomRequest(null); // No room request found
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 w-full justify-center">
        {/* Student Details */}

        {studentDetails && (
          <div className="bg-white text-black rounded-xl shadow-lg p-6 transform transition hover:-translate-y-1 hover:shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">Student Details</h2>
            <p className="mb-2">
              <strong className="block">Name:</strong> {studentDetails.name}
            </p>
            <p className="mb-2">
              <strong className="block">Email:</strong> {studentDetails.email}
            </p>
            <p className="mb-2">
              <strong className="block">Phone:</strong> {studentDetails.phone}
            </p>
            <p className="mb-2">
              <strong className="block">Room Number:</strong>{" "}
              {roomRequest?.roomName || "Not Assigned"}
            </p>
            <p>
              <strong className="block">Index Number:</strong>{" "}
              {studentDetails.indexNumber}
            </p>
          </div>
        )}

        {/* Room Request Status */}
        <div className="bg-white text-black rounded-xl shadow-lg p-6 transform transition hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-2xl font-semibold mb-4">Room Request Status</h2>
          {roomRequest ? (
            <div>
              <p className="mb-2">
                <strong className="block">Requested Room:</strong>{" "}
                {roomRequest?.roomName || "N/A"}
              </p>
              <p className="mb-2">
                <strong className="block">Status:</strong>{" "}
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    roomRequest.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : roomRequest.status === "not approved"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {roomRequest.status}
                </span>
              </p>
              <p>
                <strong className="block">Requested Quantity:</strong>{" "}
                {reqLength || "0"}
              </p>
            </div>
          ) : (
            <p>No room requests submitted yet.</p>
          )}
        </div>
      </div>

      {/* Maintenance Requests Table */}
      <div className="bg-white shadow-lg rounded-xl p-6 transform transition hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Maintenance Requests
        </h2>
        {maintenanceRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="px-4 py-2 text-sm uppercase">Description</th>
                  <th className="px-4 py-2 text-sm uppercase">Status</th>
                  <th className="px-4 py-2 text-sm uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 text-gray-700">
                      {request.description}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                          request.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {request.formattedDate || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">
            You have not submitted any maintenance requests yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
