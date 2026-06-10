import React from "react";
import QRCode from "react-qr-code";

const StudentQR = () => {
const student = JSON.parse(
  localStorage.getItem("user")
);

  return (
    <div className="flex justify-center">

      <div className="bg-white p-8 rounded-xl shadow text-center">

        <h2 className="text-2xl font-bold mb-5">
          My QR Code
        </h2>

        <QRCode
          value={student?.qrCode}
          size={250}
        />

        <p className="mt-4">
          Scan this QR for Attendance
        </p>

      </div>

    </div>
  );
};

export default StudentQR;