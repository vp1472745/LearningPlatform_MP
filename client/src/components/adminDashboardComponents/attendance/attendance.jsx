import React, {
  useState,
} from "react";

import {
  Scanner,
} from "@yudiel/react-qr-scanner";

import api from "../../../utils/api";

import { toast } from "react-hot-toast";

const AttendanceScanner = () => {
  const [student, setStudent] =
    useState(null);

  const handleScan = async (
    result
  ) => {
    if (!result?.[0]?.rawValue)
      return;

    try {
      const res =
        await api.post(
          "/attendance/scan",
          {
            qrCode:
              result[0].rawValue,
          }
        );

      setStudent(
        res.data.student
      );

      toast.success(
        "Attendance Marked"
      );
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-6">
        QR Attendance Scanner
      </h2>

      <Scanner
        onScan={handleScan}
      />

      {student && (
        <div className="mt-5 p-4 border rounded">

          <h3 className="font-bold">
            Attendance Marked
          </h3>

          <p>
            {student.firstName}{" "}
            {student.lastName}
          </p>

          <p>
            {
              student.enrollmentNo
            }
          </p>

        </div>
      )}
    </div>
  );
};

export default AttendanceScanner;