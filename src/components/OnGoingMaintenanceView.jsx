import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OnGoingMaintenanceView = ({ userRole, userId }) => {
  const [ongoingMaintenance, setOngoingMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOngoingMaintenance = async () => {
    try {
      let maintenanceQuery;
      if (userRole === "student") {
        // Filter records for the logged-in user
        maintenanceQuery = query(
          collection(db, "ongoingMaintenance"),
          where("user", "==", userId)
        );
      } else {
        // Fetch all records for admin or other roles
        maintenanceQuery = collection(db, "ongoingMaintenance");
      }

      const querySnapshot = await getDocs(maintenanceQuery);
      const maintenanceList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOngoingMaintenance(maintenanceList);
    } catch (error) {
      console.error("Error fetching ongoing maintenance: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOngoingMaintenance();
  }, [userId, userRole]);

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "ongoingMaintenance", id), {
        status: newStatus,
      });
      toast.success(`Status updated to ${newStatus}!`);
      await fetchOngoingMaintenance(); // Refresh the table
    } catch (error) {
      console.error("Error updating status: ", error);
      toast.error("Failed to update status!");
    }
  };

  if (loading) return <div>Loading ongoing maintenance...</div>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-lg font-bold mb-4 text-center">
        Ongoing Maintenance
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Name
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
              {userRole === "student" && (
                <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {ongoingMaintenance.map((maintenance) => (
              <tr
                key={maintenance.id}
                className="border-b bg-[#E6EBF0] border-[#E1E1E1]"
              >
                <td className="text-center px-4 py-2">{maintenance.name}</td>
                <td className="text-center px-4 py-2">{maintenance.room}</td>
                <td className="text-center px-4 py-2">
                  {maintenance.description}
                </td>
                <td className="text-center px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      maintenance.status === "Fixed"
                        ? "bg-green-700"
                        : maintenance.status === "Not Fixed"
                        ? "bg-red-700"
                        : "bg-yellow-600"
                    }`}
                  >
                    {maintenance.status}
                  </span>
                </td>
                {userRole === "student" && (
                  <td className="text-center px-4 py-2">
                    {maintenance.status !== "Fixed" &&
                    maintenance.status !== "Not Fixed" ? (
                      <>
                        <button
                          onClick={() => {
                            updateStatus(maintenance.id, "Fixed");
                          }}
                          className="bg-green-700 text-white px-4 py-2 rounded-lg mr-2"
                          disabled={maintenance.status === "Fixed"}
                        >
                          Mark as Fixed
                        </button>
                        <button
                          onClick={() => {
                            updateStatus(maintenance.id, "Not Fixed");
                          }}
                          className="bg-red-700 text-white px-4 py-2 rounded-lg"
                          disabled={maintenance.status === "Not Fixed"}
                        >
                          Mark as Not Fixed
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-700 font-semibold">
                        Action Taken
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

export default OnGoingMaintenanceView;
