import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/Mainlayout";

import Dashboard from "./pages/dashboard";
import Login from "./pages/StudentLogin";

import Attendance from "./components/adminDashboardComponents/attendance/attendance";

import SubjectList from "./components/subject/SubjectList";
import SubjectForm from "./components/subject/SubjectForm";
import EditSubject from "./components/subject/EditSubject";

import CreateBatches from "./components/adminDashboardComponents/createBatches/createBaches";
import BatchMaster from "./components/adminDashboardComponents/createBatches/masterBatches";
import EditBatch from "./components/adminDashboardComponents/createBatches/EditBatch";

import StudentsPage from "./components/adminDashboardComponents/student/StudentsPage";

import StudentDashboard from "./components/studentDashboardComponents/StudentDashboard";

import ProtectedRoute from "./utils/ProtectedRoute";
import StudentLayout from "./layouts/StudentLayout";

import StudentProfile from "./components/studentDashboardComponents/StudentProfile";
import StudentQR from "./components/studentDashboardComponents/StudentQR";
import StudentAttendance from "./components/studentDashboardComponents/StudentAttendance";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Student Dashboard */}
<Route
  path="/student-dashboard"
  element={
    <ProtectedRoute>
      <StudentLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<StudentDashboard />} />

  <Route
    path="attendance"
    element={<StudentAttendance />}
  />

  <Route
    path="qr"
    element={<StudentQR />}
  />

  <Route
    path="profile"
    element={<StudentProfile />}
  />
</Route>


        {/* Admin Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          <Route
            path="subject-master"
            element={<SubjectList />}
          />
          <Route
            path="subject-master/create"
            element={<SubjectForm />}
          />
          <Route
            path="subject-master/edit/:id"
            element={<EditSubject />}
          />

          <Route
            path="create-batch"
            element={<CreateBatches />}
          />
          <Route
            path="all-batches"
            element={<BatchMaster />}
          />
          <Route
            path="batch/edit/:id"
            element={<EditBatch />}
          />
          <Route
            path="batch/:batchId/students"
            element={<StudentsPage />}
          />

          <Route
            path="attendance"
            element={<Attendance />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;