import React from "react";
import StatCard from "../components/StatCard.tsx";

function AdminDashBoard() {
  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Available Rooms"
            value={10}
            subtitle="40 Beds"
            className="bg-purple-50"
          />
          <StatCard
            title="Room Requests"
            value={10}
            subtitle="10 Students"
            className="bg-blue-50"
          />
          <StatCard
            title="Maintenance Requests"
            value={24}
            subtitle="From 2 floors"
            className="bg-pink-50"
          />
          <StatCard
            title="Repairings"
            value={24}
            subtitle="From 3 floors"
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
