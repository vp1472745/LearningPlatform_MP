import React, { useState, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import api from "../../../utils/api";
import { toast } from "react-hot-toast";

const AttendanceScanner = () => {
  const [student, setStudent] = useState(null);

  // prevent multiple scans at same time
  const scanningRef = useRef(false);

  const handleScan = async (result) => {
    const value = result?.[0]?.rawValue;
    if (!value) return;

    // prevent duplicate rapid scans
    if (scanningRef.current) return;
    scanningRef.current = true;

    try {
      const res = await api.post("/attendance/scan", {
        qrCode: value,
        key: "MY_SECURE_APP_KEY",
      });

      setStudent(res.data.student);

      toast.success("Attendance Marked ✅");

    } catch (error) {
      const message = error?.response?.data?.message || "";

      console.log("SCAN ERROR:", message);

      // ✅ EXACT BACKEND MATCH FIX
      if (message === "Attendance already marked today") {
        toast.error("⚠️ Already marked today");
      } 
      else if (message === "Invalid QR Code") {
        toast.error("❌ Invalid QR Code");
      } 
      else if (message === "Unauthorized scanner") {
        toast.error("🚫 Unauthorized Scanner");
      } 
      else {
        toast.error(message || "Something went wrong");
      }
    } finally {
      // allow next scan after small delay
      setTimeout(() => {
        scanningRef.current = false;
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">
        QR Attendance Scanner
      </h2>

      <Scanner onScan={handleScan} />

      {student && (
        <div className="mt-5 p-4 border rounded bg-green-50">
          <h3 className="font-bold text-green-700">
            Attendance Marked Successfully
          </h3>

          <p>
            {student.firstName} {student.lastName}
          </p>
          <p>{student.enrollmentNo}</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceScanner;