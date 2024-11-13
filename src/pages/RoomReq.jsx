import { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const RoomReq = () => {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "rooms"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const availableRooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        room: doc.data().room,
        capacity: doc.data().capacity,
        occupants: doc.data().occupants,
      }));
      setRooms(availableRooms);
    });

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

    const requestsCol = collection(db, "requests");
    const unsubscribeRequests = onSnapshot(requestsCol, (snapshot) => {
      const requestsList = snapshot.docs.map((doc) => ({
        studentId: doc.data().studentId,
        roomId: doc.data().roomId,
      }));
      setRequests(requestsList);
    });

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

    const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
    if (!selectedRoom) {
      alert("Selected room not found.");
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
      roomId: selectedRoom.id,
      roomName: selectedRoom.room,
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
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto p-6">
        {/* Apply for Room and Right Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Apply for a Room Form */}
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-3xl font-bold text-[#03C988] mb-6">
              Apply for a Room
            </h2>
            <form className="space-y-6">
              <div>
                <label className="text-lg font-semibold text-gray-600">
                  Index Number
                </label>
                <input
                  type="text"
                  value={indexNumber}
                  onChange={(e) => setIndexNumber(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03C988]"
                />
              </div>
              <div>
                <label className="text-lg font-semibold text-gray-600">
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03C988]"
                />
              </div>
              <div>
                <label className="text-lg font-semibold text-gray-600">
                  Student Email
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03C988]"
                />
              </div>
              <div>
                <label className="text-lg font-semibold text-gray-600">
                  Select Room
                </label>
                <select
                  value={selectedRoomId || ""}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03C988]"
                >
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.room} ({room.occupants}/{room.capacity})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleApplyForRoom}
                className="w-full bg-[#03C988] hover:bg-[#028E68] text-white py-3 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#03C988]"
              >
                Apply for Room
              </button>
            </form>
          </div>

          {/* Right Column with Available Rooms and Students */}
          <div className="flex flex-col space-y-6">
            {/* Available Rooms */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[#03C988] mb-4">
                Available Rooms
              </h2>
              <ul>
                {rooms.length === 0 ? (
                  <li className="text-gray-600">No available rooms.</li>
                ) : (
                  rooms.map((room) => (
                    <li key={room.id} className="p-2 border-b border-gray-200">
                      Room {room.room} ({room.occupants}/{room.capacity})
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Students */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[#03C988] mb-4">
                Students
              </h2>
              <ul>
                {students.map((student) => (
                  <li key={student.id} className="p-2 border-b border-gray-200">
                    {student.name} (Room {student.roomId || "Unassigned"})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomReq;
