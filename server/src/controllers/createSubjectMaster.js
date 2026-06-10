import SubjectMaster from "../models/SubjectMaster.js";
import cloudinary from "../config/cloudinary.js";

const uploadDocuments = async (files, folder) => {
  const uploads = files.map(async (file) => {
    const uploaded = await cloudinary.uploader.upload(
      file.path,
      {
        folder,
        resource_type: "raw",
        use_filename: true,
        unique_filename: true,
        access_mode: "public",
      }
    );

    console.log("UPLOAD RESULT");
    console.log(uploaded);

    return {
      title: file.originalname,
      pdfUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  });

  return Promise.all(uploads);
};

const normalizeSubjects = (rawSubjects) => {
  if (Array.isArray(rawSubjects)) {
    return rawSubjects;
  }

  if (typeof rawSubjects === "string") {
    return JSON.parse(rawSubjects);
  }

  return [];
};

export const createSubjectMaster = async (req, res) => {
  try {
    const { branch, semester } = req.body;

    const subjects = normalizeSubjects(req.body.subjects);

    const subjectFilesMap = (req.files || []).reduce(
      (acc, file) => {
        if (!acc[file.fieldname]) {
          acc[file.fieldname] = [];
        }

        acc[file.fieldname].push(file);

        return acc;
      },
      {}
    );

    const subjectsWithDocs = await Promise.all(
      subjects.map(async (subject, index) => {
        const notesFiles =
          subjectFilesMap[`notes_${index}`] || [];

        const assignmentFiles =
          subjectFilesMap[`assignments_${index}`] || [];

        const [notes, assignments] =
          await Promise.all([
            uploadDocuments(
              notesFiles,
              "learning-platform/subjects/notes"
            ),

            uploadDocuments(
              assignmentFiles,
              "learning-platform/subjects/assignments"
            ),
          ]);

        return {
          subjectName: subject.subjectName,
          subjectCode: subject.subjectCode,
          notes,
          assignments: assignments.map(
            (assignment) => ({
              ...assignment,
              description: "",
              dueDate: null,
            })
          ),
        };
      })
    );

    const data = await SubjectMaster.create({
      branch,
      semester,
      subjects: subjectsWithDocs,
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllSubjects =
  async (req, res) => {
    try {
      const subjects =
        await SubjectMaster.find()
          .sort({
            semester: 1,
          });

      res.status(200).json({
        success: true,
        count: subjects.length,
        data: subjects,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



  export const getSubjectsBySemester =
  async (req, res) => {
    try {
      const { semester } =
        req.params;

      const subjects =
        await SubjectMaster.find({
          semester,
          isActive: true,
        });

      res.status(200).json({
        success: true,
        data: subjects,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



  export const getSubjectById =
  async (req, res) => {
    try {
      const subject =
        await SubjectMaster.findById(
          req.params.id
        );

      if (!subject) {
        return res.status(404).json({
          success: false,
          message:
            "Subject not found",
        });
      }

      res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const updateSubject = async (req, res) => {
  try {
    const existingDoc = await SubjectMaster.findById(req.params.id);

    if (!existingDoc) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const subjects = normalizeSubjects(req.body.subjects);

    const subjectFilesMap = (req.files || []).reduce((acc, file) => {
      if (!acc[file.fieldname]) {
        acc[file.fieldname] = [];
      }

      acc[file.fieldname].push(file);

      return acc;
    }, {});

    const updatedSubjects = await Promise.all(
      subjects.map(async (subject, index) => {
        const existingSubject = existingDoc.subjects.id(subject._id);

        const notesFiles =
          subjectFilesMap[`notes_${index}`] || [];

        const assignmentFiles =
          subjectFilesMap[`assignments_${index}`] || [];

        const uploadedNotes = await uploadDocuments(
          notesFiles,
          "learning-platform/subjects/notes"
        );

        const uploadedAssignments =
          await uploadDocuments(
            assignmentFiles,
            "learning-platform/subjects/assignments"
          );

        return {
          _id: subject._id,
          subjectName: subject.subjectName,
          subjectCode: subject.subjectCode,

          notes: [
            ...(existingSubject?.notes || []),
            ...uploadedNotes,
          ],

          assignments: [
            ...(existingSubject?.assignments || []),
            ...uploadedAssignments.map((a) => ({
              ...a,
              description: "",
              dueDate: null,
            })),
          ],
        };
      })
    );

    existingDoc.branch = req.body.branch;
    existingDoc.semester = req.body.semester;
    existingDoc.subjects = updatedSubjects;

    await existingDoc.save();

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: existingDoc,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  export const deleteSubject =
  async (req, res) => {
    try {
      await SubjectMaster.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Subject deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    
    
    }
  };



    export const getStudentSubjects = async (req, res) => {
  try {
    const { branch, semester } = req.query;

    const data = await SubjectMaster.findOne({
      branch,
      semester,
      isActive: true,
    });

    res.json({
      success: true,
      data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};