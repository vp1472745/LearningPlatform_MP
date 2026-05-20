import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6 md:p-8 transition-all duration-300">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center">
          Welcome to the Dashboard
        </h1>
      </div>
    </div>
  );
};

export default Dashboard;