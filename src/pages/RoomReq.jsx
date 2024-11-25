import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RoomReq = () => {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [currentUser, setCurrentUser] = useState([]);
  const user = localStorage.getItem("userId");

  useEffect(() => {
    const requestsQuery = query(
      collection(db, "users"),
      where("uid", "==", user)
    );

    const currentUser = onSnapshot(requestsQuery, (snapshot) => {
      const requestsList = snapshot.docs.map((doc) => ({
        email: doc.data().email,
        name: doc.data().name,
        indexNumber: doc.data().indexNumber,
      }));
      console.log(requestsList);
      setCurrentUser(requestsList);
    });

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

    const studentsCol = collection(db, "users");
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
        roomName: doc.data().roomName,
        status: doc.data().status,
        uid: doc.data().uid,
        studentName: doc.data().studentName,
        studentEmail: doc.data().studentEmail,
      }));
      console.log(requestsList);
      setRequests(requestsList);
    });

    return () => {
      unsubscribe();
      unsubscribeStudents();
      unsubscribeRequests();
    };
  }, []);

  const handleApplyForRoom = (e) => {
    e.preventDefault();

    if (!currentUser || currentUser.length === 0) {
      alert("User data is not loaded. Please try again.");

      toast.error("User data is not loaded. Please try again.");
      return;
    }

    if (!selectedRoomId) {
      alert("Please select a room.");

      toast.warn("Please select a room.");

      return;
    }
    const existingRequest = requests.find((request) => request.uid === user);

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        alert("You already have a pending room request.");
        toast.info("You already have a pending room request.");

        return;
      }
      if (existingRequest.status === "approved") {
        alert("You already have an approved room assignment.");
        toast.info("You already have an approved room assignment.");
        return;
      }
      if (existingRequest.status === "not approved") {
        alert(
          "Your previous request was rejected. You can apply for another room."
        );

        toast.warn(
          "Your previous request was rejected. You can apply for another room."
        );
      }
    }

    const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
    if (!selectedRoom) {
      alert("Selected room not found.");

      toast.error("Selected room not found.");
      return;
    }

    if (
      !currentUser[0]?.indexNumber ||
      !currentUser[0]?.name ||
      !currentUser[0]?.email
    ) {
      console.log(currentUser);
      alert();

      toast.error(
        "Missing user data. Please ensure you are logged in and try again."
      );
      return;
    }

    const newRequest = {
      uid: user,
      studentId: currentUser[0]?.indexNumber,
      studentName: currentUser[0]?.name,
      studentEmail: currentUser[0]?.email,
      roomId: selectedRoomId,
      roomName: selectedRoom.room,
      status: "pending",
    };

    addDoc(collection(db, "requests"), newRequest)
      .then(() => {
        toast.success("Your room request has been submitted successfully.");
        setSelectedRoomId(null);
      })
      .catch((error) => {
        console.error("Error submitting request:", error);
        toast.error("Error submitting request. Please try again later.");
      });
  };

  return (
    <>
      {/* Apply for Room and Right Column Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Apply for a Room Form */}
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-3xl font-bold text-[#003366] mb-6">
            Apply for a Room
          </h2>
          <form className="space-y-6">
            <div>
              <label className="text-lg font-semibold text-gray-600">
                Index Number
              </label>
              <input
                disabled
                type="text"
                value={indexNumber || currentUser[0]?.indexNumber || ""}
                onChange={(e) => setIndexNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-600">
                Student Name
              </label>
              <input
                disabled
                type="text"
                value={studentName || currentUser[0]?.name || ""}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-600">
                Student Email
              </label>
              <input
                disabled
                type="email"
                value={studentEmail || currentUser[0]?.email || ""}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-600">
                Select Room
              </label>
              <select
                value={selectedRoomId || ""}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
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
              className="w-full bg-[#003366] hover:bg-[#2c5093] text-white py-3 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            >
              Apply for Room
            </button>
          </form>
        </div>

        {/* Right Column with Available Rooms and Students */}
        <div className="flex flex-col space-y-6">
          {/* Available Rooms */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#003366] mb-4">
              Available Rooms
            </h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">
                    Room Name
                  </th>
                  <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">
                    Availability
                  </th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center py-2 text-gray-600">
                      No available rooms.
                    </td>
                  </tr>
                ) : (
                  rooms.map((room) => (
                    <tr key={room.id} className="border-b border-gray-200">
                      <td className="px-4 py-2">{room.room}</td>
                      <td className="px-4 py-2">
                        {room.occupants}/{room.capacity}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomReq;
