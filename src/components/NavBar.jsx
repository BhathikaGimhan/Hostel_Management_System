import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUser, setUser] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(!!currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex md:absolute flex-col md:flex-row h-screen">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col bg-[#03C988] w-64 text-white">
        <h1 className="text-3xl font-bold p-6">H.M.S</h1>
        <ul className="flex flex-col p-6 space-y-4">
          {[
            { name: "Dashboard", path: "/" },
            { name: "Admin", path: "/admin" },
            { name: "Student", path: "/student" },
            { name: "Students", path: "/students" },
            { name: isUser ? "User" : "Login", path: "/login" },
          ].map((link) => (
            <li key={link.name}>
              <NavLink
                exact={link.path === "/"}
                to={link.path}
                className="p-2 rounded hover:bg-[#028E68]"
                activeClassName="bg-[#028E68] text-yellow-400"
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Header NavBar for Mobile */}
      <div className="flex md:hidden justify-between items-center bg-[#03C988] text-white p-4">
        <h1 className="text-2xl font-bold">Hostel Management</h1>
        <button onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } bg-[#03C988] text-white md:hidden transition-all`}
      >
        <ul className="flex flex-col p-6 space-y-4">
          {[
            { name: "Dashboard", path: "/" },
            { name: "Admin", path: "/admin" },
            { name: "Student", path: "/student" },
            { name: "Students", path: "/students" },
            { name: isUser ? "User" : "Login", path: "/login" },
          ].map((link) => (
            <li key={link.name}>
              <NavLink
                exact={link.path === "/"}
                to={link.path}
                className="p-2 rounded hover:bg-[#028E68]"
                activeClassName="bg-[#028E68] text-yellow-400"
                onClick={toggleMenu}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
