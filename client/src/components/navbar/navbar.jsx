import React, { useState } from "react";
import { Link } from "react-router-dom";
import useTheme from "../../theme/useTheme"; // 👈 import

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme(); // 👈 use hook

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md transition">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* LOGO */}
        <div className="text-xl font-bold text-blue-600">
          MyApp
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* 🌙 DARK MODE BUTTON */}
          <button
            onClick={toggleTheme}
            className="px-3 py-1 border rounded dark:border-gray-600"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <button className="px-4 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
            Login
          </button>

          <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            Signup
          </button>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-2xl dark:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 bg-white dark:bg-gray-900 transition">
          <ul className="flex flex-col gap-3 font-medium dark:text-white">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>

          <div className="mt-4 flex flex-col gap-2">
            
            {/* MOBILE TOGGLE */}
            <button
              onClick={toggleTheme}
              className="border p-2 rounded dark:border-gray-600 dark:text-white"
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>

            <button className="border p-2 rounded dark:border-gray-600 dark:text-white">
              Login
            </button>

            <button className="bg-blue-600 text-white p-2 rounded">
              Signup
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;