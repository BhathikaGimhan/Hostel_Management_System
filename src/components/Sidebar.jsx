import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BedDouble,
  Users,
  DoorOpen,
  Wrench,
  LogOut,
  School,
  Menu as MenuIcon,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Menu items with roles
const menuItems = [
  { icon: LayoutDashboard, text: "Dashboard", path: "/", roles: [1] }, // Accessible to both admin and student
  {
    icon: LayoutDashboard,
    text: "User Dashboard",
    path: "/",
    roles: [2],
  },
  { icon: BedDouble, text: "Room Requests", path: "/admin", roles: [1] }, // Admin only
  { icon: DoorOpen, text: "Entry/Exit", path: "/entry-exit", roles: [1, 2] }, // Admin only
  { icon: Users, text: "Students", path: "/students", roles: [1] }, // Admin only
  { icon: Wrench, text: "Maintenance", path: "/maintenance", roles: [1, 2] }, // Admin only
  { icon: School, text: "Request Room", path: "/roomreq", roles: [2] }, // Student only
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    localStorage.removeItem("userRole");

    if (uid) {
      const studentsCol = collection(db, "users");
      const q = query(studentsCol, where("uid", "==", uid)); // Assuming 'uid' is a field in the 'users' collection

      const unsubscribeStudents = onSnapshot(q, (snapshot) => {
        const studentsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          userRole: doc.data().userRole,
        }));

        // Update role based on retrieved data
        const user = studentsList[0]; // Assuming one document per user
        if (user) {
          if (user.userRole === "admin") {
            setUserRole(1); // Admin role
            localStorage.setItem("userRole", "admin");
          } else if (user.userRole === "student") {
            setUserRole(2); // Student role
            localStorage.setItem("userRole", "student");
          }
        }
      });

      // Cleanup the listener
      return () => unsubscribeStudents();
    }
  }, []);

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="flex fixed h-screen z-10">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col h-screen transition-transform transform
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative`}
      >
        <div className="p-6">
          <h1 className="justify-center text-center text-4xl font-bold text-black mt-6">
            HMS
          </h1>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="overflow-y-auto">
            <p className="px-6 py-2 text-xs font-medium text-gray-400 uppercase">
              Main Menus
            </p>
            <nav className="mt-2">
              {filteredMenuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-sm ${
                    location.pathname === item.path
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.text}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-6 border-t border-gray-200 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden absolute top-6 left-6 p-1 text-gray-800"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
