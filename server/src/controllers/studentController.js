import XLSX from "xlsx";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import Student from "../models/Student.js";
import Batch from "../models/Batch.js";
import SubjectMaster from "../models/SubjectMaster.js";

import {
  sendStudentCredentials,
} from "../services/emailService.js";

export const importStudents = async (
  req,
  res
) => {
  try {
    const { batchId } = req.body;

    const batch =
      await Batch.findById(batchId);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Excel file required",
      });
    }

    const workbook =
      XLSX.readFile(req.file.path);

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const students =
      XLSX.utils.sheet_to_json(
        sheet,
        {
          defval: "",
        }
      );

    console.log(
      "Excel Rows:",
      students.length
    );

    let createdStudents = [];
    let skippedStudents = [];
    let emailSentCount = 0;

    for (const row of students) {
      try {
        if (
          !row.Email ||
          !row.FirstName ||
          !row.EnrollmentNo
        ) {
          skippedStudents.push({
            email:
              row.Email ||
              "Missing Email",
            reason:
              "Required fields missing",
          });

          continue;
        }

        const email =
          row.Email
            .trim()
            .toLowerCase();

        const existingStudent =
          await Student.findOne({
            $or: [
              { email },
              {
                enrollmentNo:
                  row.EnrollmentNo,
              },
            ],
          });

        if (existingStudent) {
          skippedStudents.push({
            email,
            reason:
              "Student already exists",
          });

          continue;
        }

        const username = email;

        const plainPassword =
          `${row.FirstName}@123`;

        const hashedPassword =
          await bcrypt.hash(
            plainPassword,
            10
          );

        const qrCode =
          uuidv4();

        const student =
          await Student.create({
            enrollmentNo:
              row.EnrollmentNo,

            firstName:
              row.FirstName,

            lastName:
              row.LastName || "",

            email,

            mobile:
              row.Mobile || "",

            gender:
              row.Gender || "",

            username,

            password:
              hashedPassword,

            branch:
              batch.branch,

            semester:
              batch.semester,

            batchId:
              batch._id,

            qrCode,
          });

        const emailSent =
          await sendStudentCredentials({
            name:
              row.FirstName,
            email,
            username,
            password:
              plainPassword,
          });

        if (emailSent) {
          emailSentCount++;
        }

        console.log(
          `${email} => Email Sent:`,
          emailSent
        );

        createdStudents.push({
          _id:
            student._id,
          name:
            `${student.firstName} ${student.lastName}`,
          email:
            student.email,
          username,
          qrCode,
          emailSent,
        });
      } catch (err) {
        console.log(
          "Student Import Error:",
          err.message
        );

        skippedStudents.push({
          email:
            row.Email ||
            "Unknown",
          reason:
            err.message,
        });
      }
    }

    batch.totalStudents =
      await Student.countDocuments({
        batchId:
          batch._id,
      });

    await batch.save();

    return res.status(201).json({
      success: true,

      message:
        "Students imported successfully",

      count:
        createdStudents.length,

      emailSentCount,

      skipped:
        skippedStudents.length,

      totalStudents:
        batch.totalStudents,

      createdStudents,

      skippedStudents,
    });
  } catch (error) {
    console.log(
      "Import Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};
export const getStudentsByBatch =
  async (req, res) => {
    try {
      const students =
        await Student.find({
          batchId:
            req.params.batchId,
        });

      res.status(200).json({
        success: true,
        count:
          students.length,
        data: students,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const deleteStudent =
  async (req, res) => {
    try {
      const student =
        await Student.findById(
          req.params.id
        );

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found",
        });
      }

      await student.deleteOne();

      await Batch.findByIdAndUpdate(
        student.batchId,
        {
          $inc: {
            totalStudents: -1,
          },
        }
      );

      res.status(200).json({
        success: true,
        message:
          "Student deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };



