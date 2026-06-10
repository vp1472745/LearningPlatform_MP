import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaList,
  FaBook,
  FaCalendarCheck,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaQrcode,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

const role =
  localStorage.getItem("role");

const user = JSON.parse(
  localStorage.getItem("user")
);

  const adminMenus = [
    {
      name: "Overview",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "Batch Master",
      path: "/all-batches",
      icon: <FaList />,
    },
    {
      name: "Subject Master",
      path: "/subject-master",
      icon: <FaBook />,
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: <FaCalendarCheck />,
    },
  ];

const studentMenus = [
  {
    name: "Student Material",
    path: "/student-dashboard",
    icon: <FaHome />,
  },
  {
    name: "Attendance",
    path: "/student-dashboard/attendance",
    icon: <FaCalendarCheck />,
  },
  {
    name: "My QR",
    path: "/student-dashboard/qr",
    icon: <FaQrcode />,
  },
  {
    name: "Profile",
    path: "/student-dashboard/profile",
    icon: <FaUser />,
  },
];

  const menuItems =
    role === "student"
      ? studentMenus
      : adminMenus;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  const logout = () => {
    localStorage.clear();

    window.location.href =
      role === "student"
        ? "/login"
        : "/login";
  };

  return (
    <div
      className={`fixed md:relative z-30 h-screen
      bg-white dark:bg-gray-900
      border-r dark:border-gray-700
      transition-all duration-300
      ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="p-5 border-b flex justify-between items-center">

        {isOpen ? (
          <h1 className="font-bold text-xl">
            {role === "student"
              ? "Student Panel"
              : "Admin Panel"}
          </h1>
        ) : (
          <h1 className="font-bold">
            {role === "student"
              ? "SP"
              : "AD"}
          </h1>
        )}
      </div>

      <ul className="p-4 space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }
                ${
                  !isOpen &&
                  "justify-center"
                }`
              }
            >
              {item.icon}

              {isOpen && (
                <span>{item.name}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="absolute bottom-4 left-0 right-0 px-4">

        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <FaSignOutAlt />
          {isOpen && "Logout"}
        </button>

        <button
          onClick={() =>
            setIsOpen(!isOpen)
          }
          className="mt-2 w-full bg-gray-200 py-2 rounded-lg flex justify-center"
        >
          {isOpen ? (
            <FaChevronLeft />
          ) : (
            <FaChevronRight />
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;