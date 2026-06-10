import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import api from "../../../utils/api";

const StudentsPage = () => {
  const { batchId } = useParams();

  const [students, setStudents] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await api.get(
        `/student/batch/${batchId}`
      );

      setStudents(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const downloadTemplate = () => {
    const sampleData = [
      {
        EnrollmentNo: "0531CS221001",
        FirstName: "Rahul",
        LastName: "Sharma",
        Email: "rahul@gmail.com",
        Mobile: "9876543210",
        Gender: "Male",
      },
    ];

    const worksheet =
      XLSX.utils.json_to_sheet(sampleData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    XLSX.writeFile(
      workbook,
      "Student_Import_Template.xlsx"
    );

    toast.success(
      "Template downloaded successfully"
    );
  };

  const handleUpload = async () => {
    if (!file) {
      return toast.error(
        "Please select Excel file"
      );
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("batchId", batchId);

      const res = await api.post(
        "/student/import",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        res.data.message ||
          "Students imported successfully"
      );

      setFile(null);

      fetchStudents();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmDelete) return;

    try {
      await api.delete(`/student/${id}`);

      toast.success(
        "Student deleted successfully"
      );

      setStudents((prev) =>
        prev.filter(
          (student) =>
            student._id !== id
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">
            Students Management
          </h2>

          <p className="text-gray-500">
            Total Students:
            <span className="font-semibold ml-2">
              {students.length}
            </span>
          </p>
        </div>
      </div>

      {/* Import Section */}
      <div className="border rounded-xl p-5 mb-8 bg-gray-50 dark:bg-gray-700">

        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          Import Students
        </h3>

        <div className="flex flex-wrap gap-3 mb-4">

          <button
            onClick={downloadTemplate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Download Excel Template
          </button>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) =>
              setFile(
                e.target.files?.[0]
              )
            }
            className="border p-2 rounded bg-white"
          />

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : "Import Students"}
          </button>
        </div>

        {file && (
          <div className="text-sm text-green-600">
            Selected File: {file.name}
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <strong>
            Required Columns:
          </strong>

          <div className="mt-2">
            EnrollmentNo,
            FirstName,
            LastName,
            Email,
            Mobile,
            Gender
          </div>
        </div>
      </div>

      {/* Student Table */}
      {loading ? (
        <div className="text-center py-10">
          Loading Students...
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full border-collapse border">

            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">

                <th className="border p-3">
                  Enrollment No
                </th>

                <th className="border p-3">
                  Name
                </th>

                <th className="border p-3">
                  Email
                </th>

                <th className="border p-3">
                  Mobile
                </th>

                <th className="border p-3">
                  Semester
                </th>

                <th className="border p-3">
                  Username
                </th>

                <th className="border p-3">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center p-5"
                  >
                    No Students Found
                  </td>
                </tr>
              ) : (
                students.map(
                  (student) => (
                    <tr
                      key={
                        student._id
                      }
                    >
                      <td className="border p-3">
                        {
                          student.enrollmentNo
                        }
                      </td>

                      <td className="border p-3">
                        {
                          student.firstName
                        }{" "}
                        {
                          student.lastName
                        }
                      </td>

                      <td className="border p-3">
                        {
                          student.email
                        }
                      </td>

                      <td className="border p-3">
                        {
                          student.mobile
                        }
                      </td>

                      <td className="border p-3">
                        Semester{" "}
                        {
                          student.semester
                        }
                      </td>

                      <td className="border p-3">
                        {
                          student.username
                        }
                      </td>

                      <td className="border p-3">

                        <button
                          onClick={() =>
                            handleDelete(
                              student._id
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                      </td>
                    </tr>
                  )
                )
              )}

            </tbody>
          </table>

        </div>
      )}
    </div>
  );
};

export default StudentsPage;