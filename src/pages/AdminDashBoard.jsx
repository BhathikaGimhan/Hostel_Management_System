import React, { useState, useEffect } from "react";
import StatCard from "../components/StatCard.tsx";
import { db } from "../firebase/firebase"; // Assuming db is your Firestore instance
import { collection, getDocs } from "firebase/firestore";

function AdminDashBoard() {
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [repairingCount, setRepairingCount] = useState(0);
  const [roomRequestsCount, setRoomRequestsCount] = useState(0);
  const [roomAvailableCount, setRoomAvailableCount] = useState(0);
  const [beds, setBeds] = useState(0);

  // Fetch maintenance requests count from Firestore
  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "maintenanceRequests")
        );
        const maintenanceRequests = querySnapshot.docs.filter(
          (doc) => doc.data().status === "Pending"
        );
        setMaintenanceCount(maintenanceRequests.length);
      } catch (error) {
        console.error("Error fetching maintenance requests: ", error);
      }
    };

    const fetchRepairingRequests = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "maintenanceRequests")
        );
        const repairingRequests = querySnapshot.docs.filter(
          (doc) => doc.data().status === "Approved"
        );
        setRepairingCount(repairingRequests.length);
      } catch (error) {
        console.error("Error fetching repairing requests: ", error);
      }
    };

    const fetchRoomRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "requests"));
        setRoomRequestsCount(querySnapshot.size); // Assuming each document is a request
      } catch (error) {
        console.error("Error fetching room requests: ", error);
      }
    };

    const fetchRoomAvailable = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rooms"));
        setRoomAvailableCount(querySnapshot.size); // Assuming each document is a request
        setBeds(querySnapshot.size * 4);
      } catch (error) {
        console.error("Error fetching room requests: ", error);
      }
    };

    // Call the functions to fetch data
    fetchMaintenanceRequests();
    fetchRepairingRequests();
    fetchRoomRequests();
    fetchRoomAvailable();
  }, []);

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Rooms"
            value={roomAvailableCount}
            subtitle={`${beds} Beds`}
            className="bg-purple-50"
          />
          <StatCard
            title="Room Requests"
            value={roomRequestsCount}
            subtitle="Requests"
            className="bg-blue-50"
          />
          <StatCard
            title="Maintenance Requests"
            value={maintenanceCount}
            subtitle="Pending"
            className="bg-pink-50"
          />
          <StatCard
            title="Repairings"
            value={repairingCount}
            subtitle="Pending"
            className="bg-red-50"
          />
        </div>

        {/* Additional charts or content can go here */}
        {/* <div className="grid grid-cols-2 gap-6">
          <RoomsChart />
        </div> */}
      </div>
    </>
  );
}

export default AdminDashBoard;
