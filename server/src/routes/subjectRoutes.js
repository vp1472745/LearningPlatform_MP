import express from "express";
import {
  createSubjectMaster,
  getAllSubjects,
  deleteSubject,
  updateSubject,
  getSubjectById,
  getSubjectsBySemester,
    getStudentSubjects
} from "../controllers/createSubjectMaster.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/create",
  upload.any(),
  createSubjectMaster
);
router.get("/student", getStudentSubjects);  // 👈 MUST BE FIRST


router.get("/", getAllSubjects);

router.get("/semester/:semester", getSubjectsBySemester);

router.get("/:id", getSubjectById);

router.put("/:id", updateSubject);

router.delete("/:id", deleteSubject);



export default router;