import React from "react";
import {
  FaSearch,
  FaBell,
  FaUserPlus,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

function TopNavBar() {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Left Search Bar */}
      <div className="flex items-center bg-gray-100 p-2 rounded-lg">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search here"
          className="bg-gray-100 outline-none"
        />
      </div>

      {/* Right Icons and Profile */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <FaBell className="text-gray-500" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">DM</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Durdans Medical</p>
            <p className="text-xs text-gray-500">admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNavBar;
