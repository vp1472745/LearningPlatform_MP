import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

export const markAttendanceByQR = async (
  req,
  res
) => {
  try {
    const { qrCode } = req.body;

    const student =
      await Student.findOne({
        qrCode,
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Invalid QR Code",
      });
    }

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const alreadyMarked =
      await Attendance.findOne({
        studentId: student._id,
        date: today,
      });

    if (alreadyMarked) {
      return res.status(400).json({
        success: false,
        message:
          "Attendance already marked today",
      });
    }

    await Attendance.create({
      studentId: student._id,
      batchId: student.batchId,
      date: today,
      status: "Present",
    });

    return res.status(200).json({
      success: true,
      message:
        "Attendance marked successfully",
      student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAttendanceByBatch =
  async (req, res) => {
    try {
      const attendance =
        await Attendance.find({
          batchId:
            req.params.batchId,
        })
          .populate(
            "studentId",
            "enrollmentNo firstName lastName"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };