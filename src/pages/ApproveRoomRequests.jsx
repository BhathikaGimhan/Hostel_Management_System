import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const ApproveRoomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const requestsQuery = query(
      collection(db, "requests"),
      where("request", "==", "pending")
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        studentId: doc.data().studentId,
        roomId: doc.data().roomId,
        roomName: doc.data().roomName,
      }));
      setRequests(requestsList);
    });

    const unsubscribeRooms = onSnapshot(collection(db, "rooms"), (snapshot) => {
      const roomsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        capacity: doc.data().capacity,
        occupants: doc.data().occupants,
      }));
      setRooms(roomsList);
    });

    return () => {
      unsubscribeRequests();
      unsubscribeRooms();
    };
  }, []);

  const handleApproveRequest = async (requestId, roomId) => {
    const roomToUpdate = rooms.find((room) => room.id === roomId);

    if (roomToUpdate && roomToUpdate.occupants < roomToUpdate.capacity) {
      const updatedOccupants = roomToUpdate.occupants + 1;

      await updateDoc(doc(db, "rooms", roomId), {
        occupants: updatedOccupants,
      });
      await updateDoc(doc(db, "requests", requestId), { request: "approved" });

      alert("Request approved successfully!");
    } else {
      alert("Room is already full or not found!");
    }
  };

  const handleNotApproveRequest = async (requestId) => {
    await updateDoc(doc(db, "requests", requestId), {
      request: "not approved",
    });
    alert("Request not approved!");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-3xl font-bold text-[#31a831] mb-6">
        Approve Room Requests
      </h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left font-semibold text-gray-600">
              Student ID
            </th>
            <th className="border px-4 py-2 text-left font-semibold text-gray-600">
              Room Name
            </th>
            <th className="border px-4 py-2 text-left font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center p-4 text-gray-600">
                No pending requests
              </td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr key={request.id} className="border-b border-gray-200">
                <td className="px-4 py-2">{request.studentId}</td>
                <td className="px-4 py-2">{request.roomName}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() =>
                      handleApproveRequest(request.id, request.roomId)
                    }
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleNotApproveRequest(request.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Not Approve
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApproveRoomRequests;
