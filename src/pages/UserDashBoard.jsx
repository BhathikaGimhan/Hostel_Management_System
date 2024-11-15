import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Loading from "../components/Loading";

function StudentDashboard() {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div className="h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
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

      {/* Maintenance Requests Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Maintenance Requests
        </h2>
        {maintenanceRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b hover:bg-gray-100 transition duration-200"
                  >
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
