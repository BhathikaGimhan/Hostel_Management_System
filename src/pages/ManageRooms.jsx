import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentRoomDetails, setCurrentRoomDetails] = useState(null);

  // Fetch rooms from Firestore
  useEffect(() => {
    const fetchRooms = async () => {
      const roomsQuery = query(collection(db, "rooms"));
      const roomsSnapshot = await getDocs(roomsQuery);
      const roomsList = roomsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsList);
    };

    fetchRooms();
  }, []);

  // Fetch students based on room number and request approval
  const fetchStudentDetails = async (roomNumber) => {
    const requestsQuery = query(
      collection(db, "requests"),
      where("roomName", "==", roomNumber),
      where("status", "==", "approved")
    );

    const requestsSnapshot = await getDocs(requestsQuery);

    if (!requestsSnapshot.empty) {
      const studentsDetails = requestsSnapshot.docs.map((doc) => ({
        studentId: doc.id,
        studentName: doc.data().studentName,
        studentEmail: doc.data().studentEmail,
        roomId: doc.data().roomId,
        roomName: doc.data().roomName,
        status: doc.data().status,
      }));

      setStudentsData(studentsDetails); // Store the students' details
    } else {
      toast.error("No approved requests found for this room.", {
        position: "top-right",
      });
    }
  };

  // Handle opening the view modal for a specific room
  const openViewModal = (room) => {
    setSelectedRoom(room);
    setCurrentRoomDetails(room);
    fetchStudentDetails(room.room); // Fetch the students when opening the modal
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setCurrentRoomDetails(null);
    setStudentsData([]); // Clear students data when closing modal
  };

  // Handle deleting the room
  const handleDeleteRoom = async () => {
    if (selectedRoom) {
      try {
        await deleteDoc(doc(db, "rooms", selectedRoom.id)); // doc used here
        toast.success("Room deleted successfully!", { position: "top-right" });
        setShowModal(false);
        setSelectedRoom(null);
        // Remove the room from the list immediately after deletion
        setRooms(rooms.filter((room) => room.id !== selectedRoom.id));
      } catch (error) {
        console.error("Error deleting room:", error);
        toast.error("Failed to delete the room.", { position: "top-right" });
      }
    }
  };

  const openDeleteModal = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  // Handle updating the room
  const handleUpdateRoom = async () => {
    if (currentRoomDetails) {
      try {
        const roomRef = doc(db, "rooms", currentRoomDetails.id);
        await updateDoc(roomRef, {
          capacity: currentRoomDetails.capacity,
          occupants: currentRoomDetails.occupants,
        });
        toast.success("Room updated successfully!", { position: "top-right" });
        setShowViewModal(false);
      } catch (error) {
        console.error("Error updating room:", error);
        toast.error("Failed to update room.", { position: "top-right" });
      }
    }
  };

  // Remove student from room
  const removeStudent = async (studentId) => {
    if (currentRoomDetails) {
      try {
        // 1. Update the room's occupants
        const roomRef = doc(db, "rooms", currentRoomDetails.id);
        const roomDoc = await getDoc(roomRef);
        if (roomDoc.exists()) {
          const roomData = roomDoc.data();
          const newOccupantsCount = roomData.occupants - 1;

          // Update the room's occupants count
          await updateDoc(roomRef, {
            occupants: newOccupantsCount,
          });
        }

        // 2. Update the student's status in the requests collection
        const studentRef = doc(db, "requests", studentId);
        await updateDoc(studentRef, {
          status: "not approved", // Set the status to not approved
        });

        // Notify the user
        toast.success("Student removed successfully!", {
          position: "top-right",
        });

        // Update the local studentsData to reflect the removal
        setStudentsData(
          studentsData.filter((student) => student.studentId !== studentId)
        );
      } catch (error) {
        console.error("Error removing student:", error);
        toast.error("Failed to remove student.", { position: "top-right" });
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 mb-6">
      <h2 className="text-2xl font-bold text-[#003366] mb-3">Manage Rooms</h2>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-gray-300 overflow-x-auto">
          {/* Table Header */}
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
          {/* Table Body */}
          <tbody>
            {rooms.map((room) => (
              <tr
                key={room.id}
                className="border-b bg-[#E6EBF0] border-[#E1E1E1]"
              >
                <td className="text-center px-4 py-2">{room.room}</td>
                <td className="text-center px-4 py-2">{room.capacity}</td>
                <td className="text-center px-4 py-2">{room.occupants}</td>
                <td className="text-center px-4 py-2">
                  <button
                    onClick={() => openViewModal(room)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openDeleteModal(room)} // Opens delete confirmation modal
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center w-96">
            <h3 className="text-lg font-semibold mb-4">
              Room Details: {currentRoomDetails?.room}
            </h3>
            <div className="mb-4">
              <label className="block text-left font-semibold">Capacity</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={currentRoomDetails?.capacity || ""}
                onChange={(e) =>
                  setCurrentRoomDetails({
                    ...currentRoomDetails,
                    capacity: e.target.value,
                  })
                }
              />
            </div>

            {/* Show Students in the Modal */}
            <div className="mb-4">
              <label className="block text-left font-semibold">Students</label>
              <ul className="space-y-2">
                {studentsData?.map((student) => (
                  <li
                    key={student.studentId}
                    className="flex justify-between items-center"
                  >
                    <span>{student.studentName}</span>
                    <button
                      onClick={() => removeStudent(student.studentId)} // Call removeStudent on click
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleUpdateRoom}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Update Room
              </button>
              <button
                onClick={closeViewModal}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center w-96">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this room?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteRoom}
                className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                Yes
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ManageRooms;
