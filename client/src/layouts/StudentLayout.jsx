import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";

const StudentLayout = () => {
  return (
    <div className="flex flex-col h-screen">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN SECTION */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR */}
        <Sidebar />

        {/* CONTENT */}
        <main className="flex-1 p-4 dark:bg-gray-900 overflow-y-auto">
            <Outlet />
        </main>

      </div>

      {/* FOOTER */}
      {/* <Footer /> */}

    </div>
  );
};

export default StudentLayout;