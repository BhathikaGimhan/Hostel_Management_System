import React from "react";

function RequestMaintenace() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-[#000] mb-6">
        Maintenace Requests
      </h2>
      <form className="space-y-6">
        <div>
          <label className="text-lg font-semibold text-gray-600">
            Student Name
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
          />
        </div>
        <div>
          <label className="text-lg font-semibold text-gray-600">
            Student Phone Number
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
          />
        </div>
        <div>
          <label className="text-lg font-semibold text-gray-600">
            Room Number
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
          />
        </div>
        <div>
          <label className="text-lg font-semibold text-gray-600">
            Select Maintenace
          </label>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]">
            <option value="">Select Maintenace</option>
          </select>
        </div>
        <button className="w-full bg-[#003366] hover:bg-[#2c5093] text-white py-3 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#003366]">
          Request for Maintenace
        </button>
      </form>
    </div>
  );
}

export default RequestMaintenace;
