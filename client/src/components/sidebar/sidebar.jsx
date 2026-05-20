import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaHome, FaPlusCircle, FaList, FaCalendarCheck, 
  FaSignOutAlt, FaBars, FaTimes, FaChevronLeft, FaChevronRight
} from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    { name: "Overview", path: "/", icon: <FaHome /> },
    { name: "Create Batches", path: "/create-batch", icon: <FaPlusCircle /> },
    { name: "All Batches", path: "/all-batches", icon: <FaList /> },
    { name: "Attendance", path: "/attendance", icon: <FaCalendarCheck /> },
  ];

  // Determine initial state based on screen width
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // Auto-close on mobile resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div
      className={`
        fixed md:relative z-30 h-screen
        flex flex-col
        bg-white dark:bg-gray-900
        text-gray-800 dark:text-white
        border-r border-gray-200 dark:border-gray-700
        transition-all duration-300
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* LOGO area */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {isOpen ? (
          <h1 className="text-2xl font-bold whitespace-nowrap">AdminDashboard</h1>
        ) : (
          <div className="w-full flex justify-center">
            <span className="text-2xl font-bold">AD</span>
          </div>
        )}
        {/* Mobile close button (only visible when open on small screens) */}
        {isOpen && (
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimes size={20} />
          </button>
        )}
      </div>

      {/* MENU ITEMS */}
      <ul className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-3 rounded-lg font-medium
                transition-all duration-200
                ${isActive 
                  ? "bg-gray-200 dark:bg-gray-700" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }
                ${!isOpen && "justify-center"}
              `
              }
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* FOOTER BUTTONS (Logout + Toggle) */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3 mb-15">

        {/* Toggle Button (Open/Close) with different icons */}
        <button
          onClick={toggleSidebar}
          className="w-full py-3 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition flex items-center justify-center gap-2"
        >
          {isOpen ? (
            <>
              <FaChevronLeft /> 
            </>
          ) : (
            <FaChevronRight size={18} />
          )}
        </button>
      </div>

      {/* Mobile overlay when sidebar is open (tapping outside closes it) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[-1] md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Sidebar;