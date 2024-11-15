import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase"; // Firebase instance
import { collection, query, where, getDocs } from "firebase/firestore";

function StudentDashboard({ user }) {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch student details and maintenance requests
  useEffect(() => {
    if (user?.uid) {
      const fetchStudentDetails = async () => {
        try {
          setLoading(true);
          // Fetch student details from the "students" collection
          const studentQuery = query(
            collection(db, "students"),
            where("uid", "==", user.uid)
          );
          const studentSnapshot = await getDocs(studentQuery);
          if (!studentSnapshot.empty) {
            setStudentDetails(studentSnapshot.docs[0].data());
          }

          // Fetch maintenance requests related to the student
          const maintenanceQuery = query(
            collection(db, "maintenanceRequests"),
            where("uid", "==", user.uid)
          );
          const maintenanceSnapshot = await getDocs(maintenanceQuery);
          const requests = maintenanceSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMaintenanceRequests(requests);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchStudentDetails();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>

        {/* Student Details Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Student Details</h3>
          {studentDetails ? (
            <div className="bg-blue-50 p-4 rounded-lg">
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
              <p>
                <strong>Other Details:</strong> {studentDetails.otherDetail}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No details available.</p>
          )}
        </div>

        {/* Maintenance Requests Section */}
        <div>
          <h3 className="text-xl font-semibold mb-3">
            Your Maintenance Requests
          </h3>
          {maintenanceRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full bg-white shadow-md rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceRequests.map((request) => (
                    <tr key={request.id} className="border-b">
                      <td className="px-4 py-2">{request.description}</td>
                      <td
                        className={`px-4 py-2 font-bold ${
                          request.status === "Approved"
                            ? "text-green-600"
                            : request.status === "Rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {request.status}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(request.date).toLocaleString()}
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
    </div>
  );
}

export default StudentDashboard;
