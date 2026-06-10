import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import studentRoutes from "./routes/studentRoute.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import studentAuthRoutes from "./routes/studentAuthRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Smart Learning Platform API Running");
});

app.use("/api/student", studentRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/batch", batchRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", studentAuthRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});
