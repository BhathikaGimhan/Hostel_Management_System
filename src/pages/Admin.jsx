import React, { useState } from "react";
import AddRoom from "./AddRoom";
import ApproveRoomRequests from "./ApproveRoomRequests";
import ManageRooms from "./ManageRooms.jsx";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("approve");

  // Function to handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-1 p-2">
      <div className="w-full">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => handleTabClick("approve")}
            className={`flex-1 py-3 text-center font-semibold ${
              activeTab === "approve"
                ? "border-b-2 border-[#003366] text-[#003366]"
                : "text-gray-600 hover:text-[#2c5093]"
            }`}
          >
            Approve Rooms
          </button>
          <button
            onClick={() => handleTabClick("add")}
            className={`flex-1 py-3 text-center font-semibold ${
              activeTab === "add"
                ? "border-b-2 border-[#003366] text-[#003366]"
                : "text-gray-600 hover:text-[#2c5093]"
            }`}
          >
            Add Room
          </button>
          <button
            onClick={() => handleTabClick("manage")}
            className={`flex-1 py-3 text-center font-semibold ${
              activeTab === "manage"
                ? "border-b-2 border-[#003366] text-[#003366]"
                : "text-gray-600 hover:text-[#2c5093]"
            }`}
          >
            Manage Rooms
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "approve" && <ApproveRoomRequests />}
          {activeTab === "add" && <AddRoom />}
          {activeTab === "manage" && <ManageRooms />}
        </div>
      </div>
    </div>
  );
}
