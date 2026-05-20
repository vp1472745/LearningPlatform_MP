import React, { useState } from "react";
import { Link } from "react-router-dom";
import useTheme from "../../theme/useTheme"; 
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="max-w-8xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* LOGO */}
        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Smart Learning Portal   
        </div>

        {/* RIGHT SIDE - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="px-3 py-1  rounded dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === "light" ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
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
            <button
              onClick={toggleTheme}
              className="border p-2 rounded dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;