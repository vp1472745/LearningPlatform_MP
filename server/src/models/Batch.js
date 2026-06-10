import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    session: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    totalStudents: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Batch = mongoose.model(
  "Batch",
  batchSchema
);

export default Batch;