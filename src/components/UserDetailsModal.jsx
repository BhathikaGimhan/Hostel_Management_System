import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase"; // Firebase instance
import { collection, query, where, getDocs } from "firebase/firestore";

function UserDetailsModal({ user }) {
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
      </div>
    </div>
  );
}

export default UserDetailsModal;
