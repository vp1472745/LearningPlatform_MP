import express from "express";

import {
  importStudents,
  getStudentsByBatch,
  deleteStudent,

} from "../controllers/studentController.js";

import upload from "../middleware/upload.js";

const router =
  express.Router();

router.post(
  "/import",
  upload.single("file"),
  importStudents
);

router.get(
  "/batch/:batchId",
  getStudentsByBatch
);

router.delete(
  "/:id",
  deleteStudent
);


export default router;