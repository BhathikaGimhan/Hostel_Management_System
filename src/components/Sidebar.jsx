import React from 'react';
import { LayoutDashboard, BedDouble, Users, DoorOpen, Wrench, LogOut } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, text: 'Dashboard', active: true },
  { icon: BedDouble, text: 'Room Requests' },
  { icon: DoorOpen, text: 'Entry/Exit' },
  { icon: Users, text: 'Students' },
  { icon: Wrench, text: 'Maintenance' },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">HMS</h1>
      </div>
      
      <div className="flex-1">
        <p className="px-6 py-2 text-xs font-medium text-gray-400 uppercase">Main Menu</p>
        <nav className="mt-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-6 py-3 text-sm ${
                item.active
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.text}
            </a>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-gray-200">
        <button className="flex items-center text-gray-600 hover:text-gray-800">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}