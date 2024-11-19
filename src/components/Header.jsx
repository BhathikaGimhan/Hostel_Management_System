import React, { useEffect, useState } from "react";
import { Search, MapPinHouse, MessageSquare } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const uid = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to authentication state
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser.displayName);
        setCurrentUser(currentUser);
      }
    });

    // Query user role from Firestore
    if (uid) {
      const studentsCol = collection(db, "users");
      const q = query(studentsCol, where("uid", "==", uid));

      const unsubscribeStudents = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data(); // Get the first matching document
          setUserRole(userData.userRole || ""); // Safely set user role
        } else {
          console.warn("No user data found for the given UID.");
          setUserRole(""); // Reset to avoid stale data
        }
      });

      // Cleanup Firestore subscription
      return () => unsubscribeStudents();
    }

    // Cleanup authentication subscription
    return () => unsubscribeAuth();
  }, [uid]);

  const userhandle = () => {
    navigate("/login");
  };

  // Handle navigation to pages
  const navigateToLocation = () => {
    navigate("/location"); // Assuming the location page route is /location
  };

  const navigateToMessages = () => {
    navigate("/messages"); // Assuming the messages page route is /messages
  };

  const navigateToProfile = () => {
    navigate("/login"); // Assuming the profile page route is /profile
  };

  return (
    <header className="fixed w-full bg-white border-b border-gray-200 px-6 py-4 pl-64">
      <div className="flex items-center justify-between flex-wrap ml-10">
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
            <button
              className="p-2 text-gray-400 hover:text-gray-600"
              onClick={navigateToLocation} // Navigate to location page
            >
              <MapPinHouse className="w-6 h-6" />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-gray-600"
              onClick={navigateToMessages} // Navigate to message page
            >
              <MessageSquare className="w-6 h-6" />
            </button>
          </div>

          {/* Profile section (always visible) */}
          <button
            className="flex items-center space-x-3"
            onClick={navigateToProfile}
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-medium text-sm">
                {currentUser ? currentUser.displayName : "Guest"}
              </span>
              <span className="text-xs text-gray-500">
                {userRole ? `Role: ${userRole}` : "Role not assigned"}
              </span>
            </div>
            <img
              src={currentUser ? currentUser.photoURL : "/default-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
