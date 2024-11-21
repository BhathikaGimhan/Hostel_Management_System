import React, { useState, useEffect } from "react";
import StatCard from "../components/StatCard.tsx";
import { db } from "../firebase/firebase"; // Assuming db is your Firestore instance
import { collection, getDocs } from "firebase/firestore";

function AdminDashBoard() {
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [repairingCount, setRepairingCount] = useState(0);
  const [roomRequestsCount, setRoomRequestsCount] = useState(0);
  const [roomAvailableCount, setRoomAvailableCount] = useState(0);
  const [totalBeds, setTotalBeds] = useState(0);
  const [availableBeds, setAvailableBeds] = useState(0);
  const [bookedBeds, setBookedBeds] = useState(0);
  const [bedBookingPercentage, setBedBookingPercentage] = useState(0);

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
          collection(db, "ongoingMaintenance")
        );
        const repairingRequests = querySnapshot.docs.filter(
          (doc) => doc.data().status === "Pending"
        );
        setRepairingCount(repairingRequests.length);
      } catch (error) {
        console.error("Error fetching repairing requests: ", error);
      }
    };

    const fetchRoomRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "requests"));
        const pendingRequests = querySnapshot.docs.filter(
          (doc) => doc.data().status === "Pending"
        );
        setRoomRequestsCount(pendingRequests.length);
      } catch (error) {
        console.error("Error fetching room requests: ", error);
      }
    };

    const fetchRoomData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rooms"));
        let totalBedsCount = 0;
        let availableBedsCount = 0;
        let bookedBedsCount = 0;

        querySnapshot.docs.forEach((doc) => {
          const roomData = doc.data();
          const roomCapacity = roomData.capacity || 0; // Total beds in the room
          const occupants = roomData.occupants || 0; // Current occupants in the room

          totalBedsCount += roomCapacity;
          bookedBedsCount += occupants; // Beds currently occupied
          availableBedsCount += roomCapacity - occupants; // Remaining beds
        });

        setRoomAvailableCount(querySnapshot.size);
        setTotalBeds(totalBedsCount);
        setAvailableBeds(availableBedsCount);
        setBookedBeds(bookedBedsCount);
        setBedBookingPercentage(
          ((bookedBedsCount / totalBedsCount) * 100).toFixed(2)
        );
      } catch (error) {
        console.error("Error fetching room data: ", error);
      }
    };

    // Call the functions to fetch data
    fetchMaintenanceRequests();
    fetchRepairingRequests();
    fetchRoomRequests();
    fetchRoomData();
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
            subtitle={`${totalBeds} Beds`}
            className="bg-purple-50"
          />
          <StatCard
            title="Room Requests"
            value={roomRequestsCount}
            subtitle="Pending"
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

        {/* Bed Booking Percentage Card */}
        <div className="bg-gray-100 shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Percentage of Rooms Booked
          </h3>
          <div className="flex items-center mb-10">
            <div>
              <div className="flex items-center space-x-2 mr-14 max-sm:mr-7">
                <div className="w-10 h-3 bg-[#003366] rounded-e-3xl"></div>
                <div className="grid mt-4">
                  <span className="text-gray-600">Booked</span>
                  <p className="text-sm text-gray-800">{bookedBeds} beds</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-3 bg-gray-300 rounded-e-3xl"></div>
                <div className="grid mt-4">
                  <span className="text-gray-600">Available</span>
                  <p className="text-sm text-gray-800">{availableBeds} beds</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-[#003366] h-4 rounded-full"
              style={{ width: `${bedBookingPercentage}%` }}
            ></div>
          </div>
          <p className="text-right mt-2 text-sm text-gray-600">
            {bedBookingPercentage}% of beds are booked
          </p>
        </div>
      </div>
    </>
  );
}

export default AdminDashBoard;
