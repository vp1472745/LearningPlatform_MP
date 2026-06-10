import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../../../utils/api";

const BatchMaster = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
    try {
      const res = await api.get("/batch");
      setBatches(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this batch?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/batch/${id}`);

      toast.success("Batch deleted successfully");

      setBatches((prev) =>
        prev.filter((batch) => batch._id !== id)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold dark:text-white">
          Batch Master
        </h2>

<Link
  to="/create-batch"
  className="bg-green-600 text-white px-4 py-2 rounded-lg"
>
  + Create Batch
</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border p-3">Session</th>
              <th className="border p-3">Branch</th>
              <th className="border p-3">Semester</th>
              <th className="border p-3">
                Total Students
              </th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {batches.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-5"
                >
                  No batches found
                </td>
              </tr>
            ) : (
              batches.map((batch) => (
                <tr key={batch._id}>
                  <td className="border p-3">
                    {batch.session}
                  </td>

                  <td className="border p-3">
                    {batch.branch}
                  </td>

                  <td className="border p-3">
                    Semester {batch.semester}
                  </td>

                  <td className="border p-3">
                    {batch.totalStudents}
                  </td>

                  <td className="border p-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/batch/edit/${batch._id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(batch._id)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

    <Link
  to={`/batch/${batch._id}/students`}
  className="bg-purple-600 text-white px-3 py-1 rounded"
>
  Students
</Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BatchMaster;