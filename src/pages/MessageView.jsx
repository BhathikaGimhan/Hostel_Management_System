import React, { useState } from "react";
import CreateMessage from "./CreateMessage";
import MessagesPage from "./MessageItem";

function MessageView() {
  const [view, setView] = useState("inbox");
  const currentUser = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");
  return (
    <div>
      <div className="flex mb-6">
        <button
          className={`mr-4 px-4 py-2 rounded-lg ${
            view === "inbox" ? "bg-[#003366] text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("inbox")}
        >
          Inbox
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            view === "compose" ? "bg-[#003366] text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("compose")}
        >
          Send
        </button>
      </div>

      {view === "inbox" && (
        <MessagesPage userRole={userRole} currentUser={currentUser} />
      )}

      {view === "compose" && <CreateMessage currentUser={currentUser} />}
    </div>
  );
}

export default MessageView;
