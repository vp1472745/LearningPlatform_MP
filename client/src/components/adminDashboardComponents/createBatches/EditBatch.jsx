import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";

const EditBatch = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const { register, handleSubmit, reset } =
    useForm();

  useEffect(() => {
    fetchBatch();
  }, []);

  const fetchBatch = async () => {
    try {
      const res = await api.get(
        `/batch/${id}`
      );

      reset(res.data.data);
    } catch (error) {
      toast.error(
        "Failed to load batch"
      );
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await api.put(
        `/batch/${id}`,
        data
      );

      toast.success(
        "Batch updated successfully"
      );

navigate("/all-batches");
    } catch (error) {
      toast.error(
        error.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto p-6"
    >
      <input
        {...register("session")}
        className="border p-3 w-full mb-3"
      />

      <select
        {...register("branch")}
        className="border p-3 w-full mb-3"
      >
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="ME">ME</option>
        <option value="CE">CE</option>
        <option value="EE">EE</option>
      </select>

      <select
        {...register("semester")}
        className="border p-3 w-full mb-3"
      >
        {[1,2,3,4,5,6,7,8].map((sem)=>(
          <option
            key={sem}
            value={sem}
          >
            Semester {sem}
          </option>
        ))}
      </select>

      <button
        disabled={loading}
        className="bg-indigo-600 text-white px-5 py-2 rounded"
      >
        {loading
          ? "Updating..."
          : "Update Batch"}
      </button>
    </form>
  );
};

export default EditBatch;