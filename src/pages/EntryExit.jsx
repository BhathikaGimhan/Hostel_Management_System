import React from "react";
import EntryExitForm from "../components/EntryExitForm";
import LogsTable from "../components/LogsTable";

function EntryExit() {
  return (
    <div>
      <div className="p-8">
        <EntryExitForm />
        <LogsTable />
      </div>
    </div>
  );
}

export default EntryExit;
