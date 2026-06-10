import React, {
  useEffect,
  useState,
} from "react";

import api from "../../utils/api";

const StudentAttendance = () => {
const student = JSON.parse(
  localStorage.getItem("user")
);

  const [records, setRecords] =
    useState([]);

  const fetchAttendance =
    async () => {
      try {
        const res = await api.get(
          `/attendance/student/${student._id}`
        );

        setRecords(
          res.data.data || []
        );
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div>

      <h1 className="text-2xl font-bold mb-5">
        Attendance History
      </h1>

      <table className="w-full border">

        <thead>
          <tr>
            <th className="border p-3">
              Date
            </th>

            <th className="border p-3">
              Status
            </th>
          </tr>
        </thead>

        <tbody>

          {records.map((item) => (
            <tr key={item._id}>
              <td className="border p-3">
                {item.date}
              </td>

              <td className="border p-3">
                {item.status}
              </td>
            </tr>
          ))}

        </tbody>

      </table>
    </div>
  );
};

export default StudentAttendance;