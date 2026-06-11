import express from "express";
import {
  markAttendanceByQR,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/scan", markAttendanceByQR);

export default router;