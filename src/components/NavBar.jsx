import { NavLink } from "react-router-dom"; // Import NavLink from React Router
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for toggle menu
import { useState } from "react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex md:absolute flex-col md:flex-row md:h-screen">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col bg-blue-900 w-64 text-white">
        <h1 className="text-3xl font-bold p-6">Hostel Management</h1>
        <ul className="flex flex-col p-6 space-y-4">
          <li>
            <NavLink
              exact
              to="/"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700"
            >
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/manage-rooms"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700"
            >
              Manage Rooms
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/students"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700"
            >
              Students
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700"
            >
              Reports
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
        } bg-blue-900  text-white md:hidden transition-all`}
      >
        <ul className="flex flex-col p-6 space-y-4">
          <li>
            <NavLink
              exact
              to="/"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700"
              onClick={toggleMenu}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700"
              onClick={toggleMenu}
            >
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/manage-rooms"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700"
              onClick={toggleMenu}
            >
              Manage Rooms
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/students"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700"
              onClick={toggleMenu}
            >
              Students
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className="p-2 rounded hover:bg-blue-700"
              activeClassName="bg-blue-700"
              onClick={toggleMenu}
            >
              Reports
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
