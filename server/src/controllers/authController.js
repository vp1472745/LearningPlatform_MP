import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import Student from "../models/Student.js";
import Admin from "../models/Admin.js";

export const login = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // =====================
    // Check Admin
    // =====================

    const admin =
      await Admin.findOne({
        email,
      });

    if (admin) {
      const isMatch =
        await bcrypt.compare(
          password,
          admin.password
        );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid password",
        });
      }

      const token = jwt.sign(
        {
          id: admin._id,
          role: "admin",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.status(200).json({
        success: true,
        message:
          "Admin login successful",

        token,

        role: "admin",

        user: {
          _id: admin._id,
          email: admin.email,
          role: "admin",
        },
      });
    }

    // =====================
    // Check Student
    // =====================

    const student =
      await Student.findOne({
        email,
      });

    if (!student) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        student.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
        role: "student",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Student login successful",

      token,

      role: "student",

      user: {
        _id: student._id,
        firstName:
          student.firstName,
        lastName:
          student.lastName,
        email:
          student.email,
        branch:
          student.branch,
        semester:
          student.semester,
        qrCode:
          student.qrCode,
        role: "student",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};