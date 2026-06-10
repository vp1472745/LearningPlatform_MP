import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const CreateBatch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

await api.post("/batch/create", {
  session: data.session,
  branch: data.branch,
  semester: Number(data.semester),
});
      toast.success("Batch created successfully");
      reset();

   navigate("/all-batches");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create batch"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        Create Batch
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Session */}
        <div>
          <label className="block mb-2 font-medium dark:text-white">
            Session
          </label>

          <input
            type="text"
            placeholder="2026-27"
            {...register("session", {
              required: "Session is required",
            })}
            className="w-full border rounded-lg p-3 dark:bg-gray-700"
          />

          {errors.session && (
            <p className="text-red-500 text-sm mt-1">
              {errors.session.message}
            </p>
          )}
        </div>

        {/* Branch */}
        <div>
          <label className="block mb-2 font-medium dark:text-white">
            Branch
          </label>

          <select
            {...register("branch", {
              required: "Branch is required",
            })}
            className="w-full border rounded-lg p-3 dark:bg-gray-700"
          >
            <option value="">
              Select Branch
            </option>

            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
            <option value="EE">EE</option>
          </select>

          {errors.branch && (
            <p className="text-red-500 text-sm mt-1">
              {errors.branch.message}
            </p>
          )}
        </div>

        {/* Semester */}
        <div>
          <label className="block mb-2 font-medium dark:text-white">
            Semester
          </label>

          <select
            {...register("semester", {
              required: "Semester is required",
            })}
            className="w-full border rounded-lg p-3 dark:bg-gray-700"
          >
            <option value="">
              Select Semester
            </option>

            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option
                key={sem}
                value={sem}
              >
                Semester {sem}
              </option>
            ))}
          </select>

          {errors.semester && (
            <p className="text-red-500 text-sm mt-1">
              {errors.semester.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading
            ? "Creating..."
            : "Create Batch"}
        </button>
      </form>
    </div>
  );
};

export default CreateBatch;