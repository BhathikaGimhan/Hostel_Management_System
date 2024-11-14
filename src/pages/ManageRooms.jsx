import React, { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
      const roomsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsList);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteRoom = async (roomId) => {
    try {
      await deleteDoc(doc(db, "rooms", roomId));
      alert("Room deleted successfully!");
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-3xl font-bold text-[#003366] mb-6">Manage Rooms</h2>
      <table className="min-w-full  border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
              Room Name
            </th>
            <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
              Capacity
            </th>
            <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
              Occupants
            </th>
            <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-600">
                No rooms available
              </td>
            </tr>
          ) : (
            rooms.map((room) => (
              <tr
                key={room.id}
                className="border-b bg-[#E6EBF0] border-[#E1E1E1]"
              >
                <td className="text-center px-4 py-2">{room.room}</td>
                <td className="text-center px-4 py-2">{room.capacity}</td>
                <td className="text-center px-4 py-2">{room.occupants}</td>
                <td className="text-center px-4 py-2">
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
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

export default ManageRooms;
