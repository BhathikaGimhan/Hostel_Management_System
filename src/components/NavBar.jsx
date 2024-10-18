import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink for active class
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for toggle menu

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex md:absolute flex-col md:flex-row h-screen">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col bg-blue-900 w-64 text-white">
        <h1 className="text-3xl font-bold p-6">H.M.S</h1>
        <ul className="flex flex-col p-6 space-y-4">
          <li>
            <NavLink
              exact
              to="/"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700 text-yellow-400"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700 text-yellow-400"
            >
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700 text-yellow-400"
            >
              student
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/students"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700 text-yellow-400"
            >
              Students
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/login"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700 text-yellow-400"
            >
              login
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Header NavBar for Mobile */}
      <div className="flex md:hidden justify-between items-center bg-blue-900 text-white p-4">
        <h1 className="text-2xl font-bold">Hostel Management</h1>
        <button onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } bg-blue-900 text-white md:hidden  max-md:z-10  transition-all`}
      >
        <ul className="flex flex-col p-6 space-y-4">
          <li>
            <NavLink
              exact
              to="/"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700 text-yellow-400"
              onClick={toggleMenu}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700 text-yellow-400"
              onClick={toggleMenu}
            >
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700 text-yellow-400"
              onClick={toggleMenu}
            >
              student
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/students"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700 text-yellow-400"
              onClick={toggleMenu}
            >
              Students
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/login"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700 text-yellow-400"
              onClick={toggleMenu}
            >
              login
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
