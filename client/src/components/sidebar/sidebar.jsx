import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen flex flex-col 
    bg-white dark:bg-gray-900 
    text-black dark:text-white transition">



      {/* MENU */}
      <ul className="flex-1 p-4 space-y-2">

        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded transition ${
                isActive
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
            OverView 
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded transition ${
                isActive
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
            Create Faculty
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded transition ${
                isActive
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
            ⚙️ Settings
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded transition ${
                isActive
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
            📊 Reports
          </NavLink>
        </li>

      </ul>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <button className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;