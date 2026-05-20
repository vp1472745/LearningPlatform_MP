import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/Mainlayout";

import Dashboard from "./pages/dashboard";
import CreateBatches from "../src/components/adminDashboardComponents/createBatches/createBaches";
import Attendance from "../src/components/adminDashboardComponents/attendance/attendance"

const App = () => {

  return (

    <BrowserRouter>

      <Routes>

        {/* MAIN LAYOUT */}
        <Route element={<MainLayout />}>

          {/* DASHBOARD */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* CREATE BATCH */}
          <Route
            path="/create-batch"
            element={<CreateBatches />}
          />

          {/* ALL BATCHES */}
          <Route
            path="/all-batches"
            element={
              <div className="p-5 text-2xl dark:text-white">
                All Batches Page
              </div>
            }
          />

          {/* ATTENDANCE */}
          <Route
            path="/attendance"
            element={
              <div className="p-5 text-2xl dark:text-white">
                <Attendance />
              </div>
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>

  );
};

export default App;