import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import jwt from "jsonwebtoken";

// SCAN QR
export const markAttendanceByQR = async (req, res) => {
  try {
    const { qrCode, key } = req.body;

    // 🔐 1. Scanner security check
    if (key !== process.env.SCAN_KEY) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized scanner",
      });
    }

    // 🔐 2. Verify QR token
    let decoded;
    try {
      decoded = jwt.verify(qrCode, process.env.QR_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired QR",
      });
    }

    // 🔍 3. Find student
    const student = await Student.findById(decoded.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 📅 4. Prevent duplicate attendance
    const today = new Date().toISOString().split("T")[0];

    const alreadyMarked = await Attendance.findOne({
      studentId: student._id,
      date: today,
    });

    if (alreadyMarked) {
      return res.status(400).json({
        success: false,
        message: "Already marked today",
      });
    }

    // ✅ 5. Save attendance
    await Attendance.create({
      studentId: student._id,
      batchId: student.batchId,
      date: today,
      status: "Present",
    });

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      student,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};