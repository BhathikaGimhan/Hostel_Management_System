import React from "react";
import { Search, Bell, MessageSquare } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between flex-wrap">
        {/* Search bar (hidden on small screens) */}
        <div className="relative flex-1 max-w-xl mb-4 sm:mb-0 hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Right-side icons and profile (hidden on mobile) */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Hide notification and chat icons on small screens */}
          <div className="hidden sm:flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-6 h-6" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MessageSquare className="w-6 h-6" />
            </button>
          </div>

          {/* Profile section (always visible) */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-medium text-sm">Udara Perera</span>
              <span className="text-xs text-gray-500">Warden</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
