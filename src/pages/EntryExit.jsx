import React, { useState } from "react";
import EntryExitForm from "../components/EntryExitForm";
import LogsTable from "../components/LogsTable";

function EntryExit({ userRole, userEmail }) {
  const [activeTab, setActiveTab] = useState("logs");

  // Function to handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Show only the form if the user is a admin
  // if (userRole === "admin") {
  //   return (
  //     <div className="flex flex-1 p-2">
  //       <div className="w-full">
  //         <LogsTable />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex w-full flex-1 p-2">
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
            Fingerprint Scanner
          </button>
          <button
            onClick={() => handleTabClick("add")}
            className={`flex-1 py-3 text-center font-semibold ${
              activeTab === "add"
                ? "border-b-2 border-[#003366] text-[#003366]"
                : "text-gray-600 hover:text-[#2c5093]"
            }`}
          >
            Entry/Exit Logs
          </button>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "logs" && <EntryExitForm />}
          {activeTab === "add" && (
            <LogsTable userRole={userRole} userEmail={userEmail} />
          )}
        </div>
      </div>
    </div>
  );
}

export default EntryExit;
