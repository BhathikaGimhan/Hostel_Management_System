import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";

const AddRoom = () => {
  const [capacity, setCapacity] = useState("");
  const [roomName, setRoomName] = useState("");
  const [occupants, setOccupants] = useState("");

  const handleAddRoom = async (e) => {
    e.preventDefault();

    if (!roomName || !capacity || !occupants) {
      alert("Please fill in all fields");
      return;
    }

    const newRoom = {
      room: roomName,
      capacity: parseInt(capacity),
      occupants: parseInt(occupants),
    };

    try {
      await addDoc(collection(db, "rooms"), newRoom);
      alert("Room added successfully");
      setRoomName("");
      setCapacity("");
      setOccupants("");
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 mb-6">
      <h2 className="text-3xl font-bold text-[#31a831] mb-6">Add New Room</h2>
      <form onSubmit={handleAddRoom} className="space-y-6">
        <div>
          <label className="text-lg font-semibold text-gray-600">
            Room Name:
          </label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31a831]"
            placeholder="Enter room name"
          />
        </div>
        <div>
          <label className="text-lg font-semibold text-gray-600">
            Capacity:
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31a831]"
            placeholder="Enter room capacity"
          />
        </div>
        <div>
          <label className="text-lg font-semibold text-gray-600">
            Occupants:
          </label>
          <input
            type="number"
            value={occupants}
            onChange={(e) => setOccupants(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#31a831]"
            placeholder="Enter current number of occupants"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#31a831] hover:bg-[#228c22] text-white py-3 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#31a831]"
        >
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
