import React, { useState, useEffect } from "react";
import MaintenanceRequestForm from "../components/MaintenanceRequestForm";
import MaintenanceRequestsView from "../components/MaintenanceRequestsView";
import OnGoingMaintenanceView from "../components/OnGoingMaintenanceView";

function Maintenance({ userRole, userId }) {
  const [activeTab, setActiveTab] = useState("add");

  useEffect(() => {
    if (userRole === "admin") {
      setActiveTab("logs"); // Default tab for admin
    }
  }, [userRole]);

  // Function to handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Show only the form if the user is a student
  if (userRole === "student") {
    return (
      <div className="flex flex-1 p-2">
        <div className="w-full">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => handleTabClick("add")}
              className={`flex-1 py-3 text-center font-semibold ${
                activeTab === "add"
                  ? "border-b-2 border-[#003366] text-[#003366]"
                  : "text-gray-600 hover:text-[#2c5093]"
              }`}
            >
              Add Request
            </button>
            <button
              onClick={() => handleTabClick("ongoing")}
              className={`flex-1 py-3 text-center font-semibold ${
                activeTab === "ongoing"
                  ? "border-b-2 border-[#003366] text-[#003366]"
                  : "text-gray-600 hover:text-[#2c5093]"
              }`}
            >
              On Going Maintenance
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "add" && <MaintenanceRequestForm />}
            {activeTab === "ongoing" && (
              <OnGoingMaintenanceView userRole={userRole} userId={userId} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show only the form if the user is an admin
  if (userRole === "admin") {
    return (
      <div className="flex flex-1 p-2">
        <div className="w-full">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => handleTabClick("logs")}
              className={`flex-1 py-3 text-center font-semibold ${
                activeTab === "logs"
                  ? "border-b-2 border-[#003366] text-[#003366]"
                  : "text-gray-600 hover:text-[#2c5093]"
              }`}
            >
              View Request
            </button>
            <button
              onClick={() => handleTabClick("ongoing")}
              className={`flex-1 py-3 text-center font-semibold ${
                activeTab === "ongoing"
                  ? "border-b-2 border-[#003366] text-[#003366]"
                  : "text-gray-600 hover:text-[#2c5093]"
              }`}
            >
              On Going Maintenance
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "logs" && <MaintenanceRequestsView />}
            {activeTab === "ongoing" && (
              <OnGoingMaintenanceView userRole={userRole} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default rendering for other roles
  return (
    <div className="flex flex-1 p-2">
      <div className="w-full">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => handleTabClick("add")}
            className={`flex-1 py-3 text-center font-semibold ${
              activeTab === "add"
                ? "border-b-2 border-[#003366] text-[#003366]"
                : "text-gray-600 hover:text-[#2c5093]"
            }`}
          >
            Add Request
          </button>
          <button
            onClick={() => handleTabClick("logs")}
            className={`flex-1 py-3 text-center font-semibold ${
              activeTab === "logs"
                ? "border-b-2 border-[#003366] text-[#003366]"
                : "text-gray-600 hover:text-[#2c5093]"
            }`}
          >
            View Request
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "add" && <MaintenanceRequestForm />}
          {activeTab === "logs" && <MaintenanceRequestsView />}
        </div>
      </div>
    </div>
  );
}

export default Maintenance;
