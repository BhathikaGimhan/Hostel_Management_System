import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import db from "../firebase/firebase"; // Firestore instance

const AddRoom = () => {
  const [capacity, setCapacity] = useState("");
  const [roomName, setRoomName] = useState("");
  const [occupants, setOccupants] = useState("");

  const handleAddRoom = async (e) => {
    e.preventDefault();

    if (!capacity || !occupants) {
      alert("Please fill in all fields");
      return;
    }

    const newRoom = {
      room: roomName,
      capacity: parseInt(capacity), // Ensure the capacity is an integer
      occupants: parseInt(occupants), // Ensure the occupants is an integer
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
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Add New Room</h1>
      <form onSubmit={handleAddRoom} className="flex flex-col">
        <label className="text-lg font-bold mb-2">Room Name:</label>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="p-2 border border-gray-400 rounded mb-4"
          placeholder="Enter room capacity"
        />

        <label className="text-lg font-bold mb-2">Capacity:</label>
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="p-2 border border-gray-400 rounded mb-4"
          placeholder="Enter room capacity"
        />

        <label className="text-lg font-bold mb-2">Occupants:</label>
        <input
          type="number"
          value={occupants}
          onChange={(e) => setOccupants(e.target.value)}
          className="p-2 border border-gray-400 rounded mb-4"
          placeholder="Enter current number of occupants"
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
