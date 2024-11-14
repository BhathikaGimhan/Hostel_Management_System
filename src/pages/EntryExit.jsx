import React from "react";
import { Clock, ArrowRight, User } from "lucide-react";

function EntryExit() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/2 md:w-1/3 lg:w-1/4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Fingerprint Entry/Exit</h2>
          <Clock className="text-gray-600" />
        </div>
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <input
            type="text"
            placeholder="Fingerprint Input"
            className="p-2 border border-gray-400 rounded-lg w-full mt-2"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <User className="text-gray-600 mr-2" />
            <span className="text-lg font-bold">Student Name</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-bold">ID: 12345</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 border border-gray-400 rounded-lg w-1/2 bg-blue-500 text-white">
            Entry
          </button>
          <button className="p-2 border border-gray-400 rounded-lg w-1/2 bg-red-500 text-white">
            Exit
          </button>
        </div>
        <button className="p-2 border border-gray-400 rounded-lg w-full bg-green-500 text-white">
          <ArrowRight className="text-white mr-2" />
          Submit
        </button>
      </div>
    </div>
  );
}

export default EntryExit;
