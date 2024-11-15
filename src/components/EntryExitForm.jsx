import React, { useState } from "react";
import { Clock, ArrowRight, User } from "lucide-react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import Loading from "../components/Loading";

function EntryExitForm() {
  const [uid, setUid] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [entryExitType, setEntryExitType] = useState("Entry");

  const handleCheckUser = async () => {
    setLoading(true);
    setUserData(null); // Clear previous data
    try {
      const userQuery = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserData(userDoc.data());
      } else {
        alert("User not found");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      alert("Failed to fetch user data. Please try again.");
    }
    setLoading(false);
  };

  const handleEntryExitSubmit = async () => {
    if (!userData) return alert("No user data found. Please check UID first.");
    setLoading(true);
    try {
      const logData = {
        uid,
        name: userData.name,
        type: entryExitType,
        timestamp: Timestamp.now(),
        indexNumber: userData.indexNumber,
        phone: userData.phone,
        email: userData.email,
        otherDetail: userData.otherDetail,
      };
      await addDoc(collection(db, "entryExitLogs"), logData);
      alert(`${entryExitType} recorded successfully.`);
    } catch (error) {
      console.error("Error logging entry/exit:", error);
      alert("Failed to record entry/exit. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center">
      {loading && <Loading />}
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/2 md:w-1/3 lg:w-1/4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Fingerprint Entry/Exit</h2>
          <Clock className="text-gray-600" />
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Enter UID"
            className="p-2 border border-gray-400 rounded-lg w-full mt-2"
          />
          <button
            onClick={handleCheckUser}
            className="mt-2 p-2 bg-blue-500 text-white rounded-lg w-full"
          >
            Check User
          </button>
        </div>

        {userData && (
          <div className="bg-gray-100 rounded-lg p-4 mt-4">
            <div className="flex items-center mb-2">
              <User className="text-gray-600 mr-2" />
              <span className="text-lg font-bold">{userData.name}</span>
            </div>
            <div className="mb-1">
              <span className="font-semibold">Email:</span> {userData.email}
            </div>
            <div className="mb-1">
              <span className="font-semibold">Phone:</span> {userData.phone}
            </div>
            <div className="mb-1">
              <span className="font-semibold">Index Number:</span>{" "}
              {userData.indexNumber}
            </div>
            <div className="mb-1">
              <span className="font-semibold">Other Details:</span>{" "}
              {userData.otherDetail}
            </div>
          </div>
        )}

        {userData && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setEntryExitType("Entry")}
                className={`p-2 w-1/2 rounded-lg ${
                  entryExitType === "Entry"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Entry
              </button>
              <button
                onClick={() => setEntryExitType("Exit")}
                className={`p-2 w-1/2 rounded-lg ${
                  entryExitType === "Exit"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Exit
              </button>
            </div>

            <button
              onClick={handleEntryExitSubmit}
              className="p-2 bg-green-500 text-white rounded-lg w-full flex items-center justify-center"
            >
              <ArrowRight className="text-white mr-2" />
              Submit {entryExitType}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EntryExitForm;
