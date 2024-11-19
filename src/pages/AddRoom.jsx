import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRoom = () => {
  const [capacity, setCapacity] = useState("");
  const [roomName, setRoomName] = useState("");
  const [occupants, setOccupants] = useState("");

  const handleAddRoom = async (e) => {
    e.preventDefault();

    if (!roomName || !capacity || !occupants) {
      toast.error("Please fill in all fields");
      return;
    }

    const newRoom = {
      room: roomName,
      capacity: parseInt(capacity),
      occupants: parseInt(occupants),
    };

    try {
      await addDoc(collection(db, "rooms"), newRoom);
      toast.success("Room added successfully");
      setRoomName("");
      setCapacity("");
      setOccupants("");
    } catch (error) {
      console.error("Error adding room:", error);
      toast.error("Failed to add room. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 mb-6">
      <h2 className="text-3xl font-bold text-[#003366] mb-6">Add New Room</h2>
      <form onSubmit={handleAddRoom} className="space-y-6">
        <div>
          <label className="text-lg font-semibold text-gray-600">
            Room Name:
          </label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            placeholder="Enter current number of occupants"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#003366] hover:bg-[#2c5093] text-white py-3 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
        >
          Add Room
        </button>
      </form>
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

export default AddRoom;
