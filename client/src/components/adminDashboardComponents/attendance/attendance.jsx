import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import api from "../../../utils/api";
import { toast } from "react-hot-toast";

const AttendanceScanner = () => {
  const [student, setStudent] = useState(null);

  const handleScan = async (result) => {
    if (!result?.[0]?.rawValue) return;

    try {
      const res = await api.post("/attendance/scan", {
        qrCode: result[0].rawValue,
        key: "MY_SECURE_APP_KEY",
      });

      setStudent(res.data.student);

      toast.success("Attendance Marked ✅");
    } catch (error) {
      const message = error.response?.data?.message;

      // ⭐ IMPORTANT FIX HERE
      if (message === "Already marked today") {
        toast.error("⚠️ Already scanned today");
      } else if (message === "Invalid or expired QR") {
        toast.error("❌ Invalid QR Code");
      } else if (message === "Unauthorized scanner") {
        toast.error("🚫 Unauthorized Scanner");
      } else {
        toast.error(message || "Something went wrong");
      }
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