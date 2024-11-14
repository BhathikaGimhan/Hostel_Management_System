import React from "react";
import MaintenanceRequestForm from "../components/MaintenanceRequestForm";
import MaintenanceRequestsView from "../components/MaintenanceRequestsView";

function Maintenance() {
  return (
    <div>
      <div className="flex flex-col md:flex-row p-4 md:p-8 gap-8">
        <div className="flex-1">
          <MaintenanceRequestForm />
        </div>
        <div className="flex-2">
          <MaintenanceRequestsView />
        </div>
      </div>
    </div>
  );
}

export default Maintenance;
