import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaTachometerAlt,
  FaUsers,
  FaSignInAlt,
} from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

const NavBar = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUser, setUser] = useState(false);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(!!currentUser);
    });
    return () => unsubscribe();
  }, []);

  const menuLinks = [
    { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
    { name: "Admin", path: "/admin", icon: <FaUser /> },
    { name: "Student", path: "/student", icon: <FaUsers /> },
    { name: "Students", path: "/students", icon: <FaUsers /> },
    { name: isUser ? "User" : "Login", path: "/login", icon: <FaSignInAlt /> },
  ];

  return (
    <div>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden p-4 fixed top-4 left-4 z-50 text-[#31a831] focus:outline-none"
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar for Desktop and Mobile */}
      <div
        className={`fixed inset-y-0 left-0 bg-[#31a831] text-white p-6 transition-transform duration-300 z-40 ${
          isSidebarExpanded ? "md:w-64" : "md:w-20"
        } ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between">
          {isSidebarExpanded && (
            <h1 className="text-2xl font-bold tracking-wide">H.M.S</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="hidden md:block p-2 focus:outline-none"
          >
            {isSidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        <ul className="flex flex-col mt-10 space-y-6">
          {menuLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                exact={link.path === "/"}
                to={link.path}
                className="flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-[#228c22]"
                activeClassName="bg-[#228c22] font-semibold text-yellow-400"
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on mobile
              >
                {link.icon}
                {isSidebarExpanded && <span className="ml-2">{link.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Background overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div
          onClick={toggleMobileMenu}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default NavBar;
