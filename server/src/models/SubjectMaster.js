import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    pdfUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  {
    _id: true,
  }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    dueDate: {
      type: Date,
    },

    pdfUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  {
    _id: true,
  }
);

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
  },

  subjectCode: {
    type: String,
    required: true,
  },

  notes: [noteSchema],

  assignments: [assignmentSchema],
});

const subjectMasterSchema = new mongoose.Schema(
  {
    branch: {
      type: String,
      required: true,
      enum: ["CSE", "ECE", "ME", "CE", "EE"],
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    subjects: [subjectSchema],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "SubjectMaster",
  subjectMasterSchema
);