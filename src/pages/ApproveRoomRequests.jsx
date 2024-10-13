import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import db from "../firebase/firebase"; // Firestore instance

const ApproveRoomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch only pending room requests from Firestore
    const requestsQuery = query(
      collection(db, "requests"),
      where("request", "==", "pending") // Filter for pending requests
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        studentId: doc.data().studentId,
        roomId: doc.data().roomId,
      }));
      setRequests(requestsList);
    });

    // Fetch rooms to get occupants info
    const unsubscribeRooms = onSnapshot(collection(db, "rooms"), (snapshot) => {
      const roomsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        capacity: doc.data().capacity,
        occupants: doc.data().occupants,
      }));
      setRooms(roomsList);
    });

    // Cleanup on unmount
    return () => {
      unsubscribeRequests();
      unsubscribeRooms();
    };
  }, []);

  const handleApproveRequest = async (requestId, roomId) => {
    const roomToUpdate = rooms[0].occupants <= rooms[0].capacity;
    console.log(roomToUpdate);
    if (roomToUpdate) {
      // Increment the occupants count
      console.log(roomToUpdate, "ss");
      const updatedOccupants = roomToUpdate.occupants + 1;
      console.log(updatedOccupants);

      // Update the room occupants in Firestore
      await updateDoc(doc(db, "rooms", roomId), {
        occupants: updatedOccupants,
      });

      // Update the request status to "approved"
      await updateDoc(doc(db, "requests", requestId), {
        request: "approved",
      });

      alert("Request approved successfully!");
    } else {
      alert("Room is already full!");
    }
  };

  const handleNotApproveRequest = async (requestId) => {
    // Update the request status to "not approved"
    await updateDoc(doc(db, "requests", requestId), {
      request: "not approved",
    });

    alert("Request not approved!");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Approve Room Requests</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Student ID</th>
            <th className="border px-4 py-2">Room ID</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="3" className="border px-4 py-2 text-center">
                No pending requests
              </td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr key={request.id}>
                <td className="border px-4 py-2">{request.studentId}</td>
                <td className="border px-4 py-2">{request.roomId}</td>
                <td className="border px-4 py-2">
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
