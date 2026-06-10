import express from "express";

import {
  markAttendanceByQR,
  getAttendanceByBatch,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post(
  "/scan",
  markAttendanceByQR
);

router.get(
  "/batch/:batchId",
  getAttendanceByBatch
);

export default router;