import React from "react";

const Footer = () => {
  return (
    <footer
      className="h-12 flex items-center justify-between px-4 text-sm
      bg-white dark:bg-gray-900
      text-gray-600 dark:text-gray-300
      border-t border-gray-300 dark:border-gray-700
      transition"
    >
      
      {/* LEFT */}
      <p>© 2026 MyApp. All rights reserved.</p>

      {/* RIGHT */}
      <div className="flex gap-4">
        <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
          Privacy
        </a>
        <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
          Terms
        </a>
        <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
          Support
        </a>
      </div>

    </footer>
  );
};

export default Footer;