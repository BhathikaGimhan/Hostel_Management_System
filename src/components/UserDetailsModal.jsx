import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";

function UserDetailsModal() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Edit mode
  const [updatedDetails, setUpdatedDetails] = useState({});

  const user = localStorage.getItem("userId"); // Fetch user ID from localStorage

  const fetchData = async () => {
    try {
      const userQuery = query(
        collection(db, "users"),
        where("uid", "==", user)
      );
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0];
        setCurrentUser({ id: userData.id, ...userData.data() });
        setUpdatedDetails(userData.data()); // Initialize editable fields
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleUpdate = async () => {
    if (currentUser?.id) {
      try {
        const userRef = doc(db, "users", currentUser.id);
        await updateDoc(userRef, updatedDetails);
        alert("User details updated successfully!");
        setIsEditing(false);
        fetchData(); // Refresh data
      } catch (error) {
        console.error("Error updating user details:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        <div className="mb-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-gray-600 mb-2">Name:</label>
                <input
                  type="text"
                  value={updatedDetails.name || ""}
                  onChange={(e) =>
                    setUpdatedDetails({
                      ...updatedDetails,
                      name: e.target.value,
                    })
                  }
                  className="w-full border-gray-200 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Reg Number:</label>
                <input
                  type="text"
                  value={updatedDetails.indexNumber || ""}
                  onChange={(e) =>
                    setUpdatedDetails({
                      ...updatedDetails,
                      indexNumber: e.target.value,
                    })
                  }
                  className="w-full border-gray-200 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">
                  Phone Number:
                </label>
                <input
                  type="text"
                  value={updatedDetails.phone || ""}
                  onChange={(e) =>
                    setUpdatedDetails({
                      ...updatedDetails,
                      phone: e.target.value,
                    })
                  }
                  className="w-full border-gray-200 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">
                  Other Details:
                </label>
                <textarea
                  value={updatedDetails.otherDetail || ""}
                  onChange={(e) =>
                    setUpdatedDetails({
                      ...updatedDetails,
                      otherDetail: e.target.value,
                    })
                  }
                  className="w-full border-gray-200 rounded-lg p-2"
                />
              </div>
            </>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {currentUser.name || "N/A"}
              </p>
              <p>
                <strong>Reg Number:</strong> {currentUser.indexNumber || "N/A"}
              </p>
              <p>
                <strong>Phone Number:</strong> {currentUser.phone || "N/A"}
              </p>
              <p>
                <strong>Other Details:</strong>{" "}
                {currentUser.otherDetail || "N/A"}
              </p>
            </>
          )}
        </div>
        <div className="flex justify-between">
          {isEditing ? (
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => setIsEditing(false)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsModal;
