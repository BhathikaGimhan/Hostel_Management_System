import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore"; // Import Firestore functions
import db from "../firebase/firebase"; // Import the Firestore instance

const RoomReq = () => {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    // Fetch rooms with available occupancy
    const q = query(collection(db, "rooms"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const availableRooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        room: doc.data().room,
        capacity: doc.data().capacity,
        occupants: doc.data().occupants,
      }));

      if (availableRooms.length === 0) {
        console.log("No available rooms found.");
      }

      setRooms(availableRooms);
    });

    // Fetch students from Firestore
    const studentsCol = collection(db, "students");
    const unsubscribeStudents = onSnapshot(studentsCol, (snapshot) => {
      const studentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        roomId: doc.data().roomId,
      }));
      setStudents(studentsList);
    });

    // Fetch room requests from Firestore
    const requestsCol = collection(db, "requests");
    const unsubscribeRequests = onSnapshot(requestsCol, (snapshot) => {
      const requestsList = snapshot.docs.map((doc) => ({
        studentId: doc.data().studentId,
        roomId: doc.data().roomId,
      }));
      setRequests(requestsList);
    });

    // Clean up on unmount
    return () => {
      unsubscribe();
      unsubscribeStudents();
      unsubscribeRequests();
    };
  }, []);

  const handleApplyForRoom = () => {
    if (!selectedRoomId || !indexNumber || !studentName || !studentEmail) {
      alert("Please fill in all fields");
      return;
    }

    const existingRequest = requests.find(
      (req) => req.studentId === indexNumber
    );
    if (existingRequest) {
      alert("You already have a pending request.");
      return;
    }

    const newRequest = {
      studentId: indexNumber,
      studentName: studentName,
      studentEmail: studentEmail,
      roomId: selectedRoomId,
      request: "pending",
    };

    addDoc(collection(db, "requests"), newRequest)
      .then(() => {
        setRequests([...requests, { id: requests.length + 1, ...newRequest }]);
        setStudentName("");
        setStudentEmail("");
        setIndexNumber("");
        setSelectedRoomId(null);
      })
      .catch((error) => {
        console.error("Error submitting request:", error);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Hostel Management System</h1>

      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="flex flex-col md:w-1/2">
          <label className="text-lg font-bold mb-2">Index Number:</label>
          <input
            type="text"
            value={indexNumber}
            onChange={(e) => setIndexNumber(e.target.value)}
            className="p-2 border border-gray-400 rounded mb-4"
          />

          <label className="text-lg font-bold mb-2">Student Name:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="p-2 border border-gray-400 rounded mb-4"
          />

          <label className="text-lg font-bold mb-2">Student Email:</label>
          <input
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            className="p-2 border border-gray-400 rounded mb-4"
          />

          <label className="text-lg font-bold mb-2">Select Room:</label>
          <select
            value={selectedRoomId || ""}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="p-2 border border-gray-400 rounded mb-4"
          >
            <option value="">Select Room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.room} ({room.occupants}/{room.capacity})
              </option>
            ))}
          </select>

          <button
            onClick={handleApplyForRoom}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Apply for Room
          </button>
        </div>

        <div className="flex flex-col md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Available Rooms:</h2>
          <ul>
            {rooms.length === 0 ? (
              <li>No available rooms.</li>
            ) : (
              rooms.map((room) => (
                <li key={room.id}>
                  Room {room.room} ({room.occupants}/{room.capacity})
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Students:</h2>
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {student.name} (Room {student.roomId})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoomReq;
