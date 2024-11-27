import React, { useState } from "react";
import { Clock, ArrowRight, User, Fingerprint } from "lucide-react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function EntryExitForm() {
  const [uid, setUid] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [entryExitType, setEntryExitType] = useState("Entry");
  const navigate = useNavigate();

  const handleCheckUser = async () => {
    setLoading(true);
    setUserData(null); // Clear previous data
    try {
      const userQuery = query(
        collection(db, "users"),
        where("fingerprintHash", "==", uid)
      );
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserData(userDoc.data());
        toast.success("User found successfully!");
      } else {
        toast.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user data. Please try again.");
    }
    setLoading(false);
  };

  const handleEntryExitSubmit = async () => {
    if (!userData)
      return toast.error("No user data found. Please check UID first.");
    setLoading(true);
    try {
      const logData = {
        uid,
        name: userData.name,
        type: entryExitType,
        timestamp: Timestamp.now(),
        indexNumber: userData.indexNumber,
        phone: userData.phone,
        fingerprintHash: userData.fingerprintHash,
        email: userData.email,
        otherDetail: userData.otherDetail,
      };
      await addDoc(collection(db, "entryExitLogs"), logData);
      toast.success(`${entryExitType} recorded successfully.`);
    } catch (error) {
      console.error("Error logging entry/exit:", error);
      toast.error("Failed to record entry/exit. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center flex-col md:flex-row">
      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-10 mb-10 w-full md:w-1/2 flex flex-col items-center">
        <Fingerprint className="w-24 h-24 text-gray-600 mx-auto mb-4" />
        <div className="flex items-center justify-center mb-4 w-full">
          <h2 className="text-lg font-bold">Fingerprint Entry/Exit </h2>
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
            className="mt-2 p-2 bg-[#003366] text-white rounded-lg w-full"
          >
            Check User
          </button>
        </div>

        {userData && (
          <div className="mt-4">
            <div className="flex-row items-center mb-4">
              <button
                onClick={() => setEntryExitType("Entry")}
                className={`p-2 w-full mb-2 rounded-lg ${
                  entryExitType === "Entry"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Entry
              </button>

              <button
                onClick={() => setEntryExitType("Short Exit")}
                className={`p-2 w-full mb-2 rounded-lg ${
                  entryExitType === "Short Exit"
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200"
                }`}
              >
                Short Exit
              </button>
              <button
                onClick={() => setEntryExitType("Long Exit")}
                className={`p-2 w-full mb-2 rounded-lg ${
                  entryExitType === "Long Exit"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Long Exit
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

      {/* User Details Section */}
      {userData && (
        <div className="bg-white justify-center text-center rounded-lg shadow-lg w-full md:w-1/2 mb-10 md:ml-10 max-sm:h-80">
          <div className="flex items-center mb-2 justify-center p-6">
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
            <span className="font-semibold">Gender:</span>{" "}
            {userData.otherDetail}
          </div>
        </div>
      )}
    </div>
  );
}

export default EntryExitForm;
