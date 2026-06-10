import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../../utils/api";

const EditSubject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [originalSubjects, setOriginalSubjects] = useState([]);
  const [newNotesFiles, setNewNotesFiles] = useState([]);
  const [newAssignmentFiles, setNewAssignmentFiles] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [deletedAssignments, setDeletedAssignments] = useState([]);
  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: { branch: "", semester: "", subjects: [] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });
  const watchedSubjects = watch("subjects");

  // Sync file arrays with form subjects length
  useEffect(() => {
    if (watchedSubjects?.length) {
      setNewNotesFiles((prev) =>
        prev.length === watchedSubjects.length
          ? prev
          : new Array(watchedSubjects.length).fill([]),
      );
      setNewAssignmentFiles((prev) =>
        prev.length === watchedSubjects.length
          ? prev
          : new Array(watchedSubjects.length).fill([]),
      );
    }
  }, [watchedSubjects?.length]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/subject/${id}`);
      const data = res.data.data;
      setOriginalSubjects(data.subjects || []);
      reset({
        branch: data.branch,
        semester: data.semester,
        subjects: (data.subjects || []).map((s) => ({
          subjectName: s.subjectName,
          subjectCode: s.subjectCode,
        })),
      });
      const subjCount = data.subjects?.length || 0;
      setNewNotesFiles(new Array(subjCount).fill([]));
      setNewAssignmentFiles(new Array(subjCount).fill([]));
    } catch (error) {
      toast.error("Failed to load subject data");
      navigate("/subject-master");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleNotesFilesChange = (index, files) => {
    const updated = [...newNotesFiles];
    updated[index] = Array.from(files);
    setNewNotesFiles(updated);
  };

  const handleAssignmentFilesChange = (index, files) => {
    const updated = [...newAssignmentFiles];
    updated[index] = Array.from(files);
    setNewAssignmentFiles(updated);
  };
  const removeExistingNote = (subjectIndex, noteIndex) => {
    const updated = [...originalSubjects];

    const removedNote = updated[subjectIndex].notes[noteIndex];

    if (removedNote?.publicId) {
      setDeletedNotes((prev) => [...prev, removedNote.publicId]);
    }

    updated[subjectIndex].notes.splice(noteIndex, 1);

    setOriginalSubjects(updated);
  };

  const removeExistingAssignment = (subjectIndex, assignmentIndex) => {
    const updated = [...originalSubjects];

    const removedAssignment =
      updated[subjectIndex].assignments[assignmentIndex];

    if (removedAssignment?.publicId) {
      setDeletedAssignments((prev) => [...prev, removedAssignment.publicId]);
    }

    updated[subjectIndex].assignments.splice(assignmentIndex, 1);

    setOriginalSubjects(updated);
  };
  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      // Build subjects from original data, but merge edited names/codes
      let updatedSubjects = originalSubjects.map((orig, idx) => {
        const formSub = formData.subjects?.[idx] || {};
        return {
          ...orig, // keeps notes, assignments, _id
          subjectName: formSub.subjectName || orig.subjectName,
          subjectCode: formSub.subjectCode || orig.subjectCode,
        };
      });

      // Add new subjects (if form has more than original)
      if (formData.subjects?.length > originalSubjects.length) {
        for (
          let i = originalSubjects.length;
          i < formData.subjects.length;
          i++
        ) {
          updatedSubjects.push({
            subjectName: formData.subjects[i].subjectName,
            subjectCode: formData.subjects[i].subjectCode,
            notes: [],
            assignments: [],
          });
        }
      }

      // If user removed subjects (form shorter than original), truncate updatedSubjects
      if (formData.subjects?.length < originalSubjects.length) {
        updatedSubjects = updatedSubjects.slice(0, formData.subjects.length);
      }

      const formDataToSend = new FormData();
      formDataToSend.append("branch", formData.branch);
      formDataToSend.append("semester", String(formData.semester));
      formDataToSend.append("subjects", JSON.stringify(updatedSubjects));

      newNotesFiles.forEach((files, idx) => {
        files.forEach((file) => formDataToSend.append(`notes_${idx}`, file));
      });
      newAssignmentFiles.forEach((files, idx) => {
        files.forEach((file) =>
          formDataToSend.append(`assignments_${idx}`, file),
        );
      });

      await api.put(`/subject/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Updated successfully");
      navigate("/subject-master");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-5 dark:text-white">
        Edit Subject Group
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <select
            {...register("branch")}
            className="border rounded-lg p-3 dark:bg-gray-700"
          >
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
            <option value="EE">EE</option>
          </select>
          <select
            {...register("semester")}
            className="border rounded-lg p-3 dark:bg-gray-700"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold dark:text-white">Subjects</h3>
            <button
              type="button"
              onClick={() => {
                append({ subjectName: "", subjectCode: "" });
                setNewNotesFiles([...newNotesFiles, []]);
                setNewAssignmentFiles([...newAssignmentFiles, []]);
                setOriginalSubjects([
                  ...originalSubjects,
                  { notes: [], assignments: [] },
                ]);
              }}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              + Add Subject
            </button>
          </div>

          {fields.map((field, idx) => {
            const original = originalSubjects[idx] || {
              notes: [],
              assignments: [],
            };
            return (
              <div
                key={field.id}
                className="border p-4 rounded-lg dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">Subject #{idx + 1}</span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        remove(idx);
                        setNewNotesFiles((prev) =>
                          prev.filter((_, i) => i !== idx),
                        );
                        setNewAssignmentFiles((prev) =>
                          prev.filter((_, i) => i !== idx),
                        );
                        setOriginalSubjects((prev) =>
                          prev.filter((_, i) => i !== idx),
                        );
                      }}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  <input
                    {...register(`subjects.${idx}.subjectName`)}
                    placeholder="Subject Name"
                    className="border rounded-lg p-2 dark:bg-gray-700"
                  />
                  <input
                    {...register(`subjects.${idx}.subjectCode`)}
                    placeholder="Subject Code"
                    className="border rounded-lg p-2 dark:bg-gray-700"
                  />
                </div>
                {original.notes?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-blue-600 mb-2">
                      Existing Notes
                    </h4>

                    <div className="space-y-2">
                      {original.notes.map((note, noteIndex) => (
                        <div
                          key={note._id}
                          className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded"
                        >
                          <span>{note.title}</span>

                          <div className="flex gap-2">
                

                            <button
                              type="button"
                              onClick={() => removeExistingNote(idx, noteIndex)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {original.assignments?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-green-600 mb-2">
                      Existing Assignments
                    </h4>

                    <div className="space-y-2">
                      {original.assignments.map(
                        (assignment, assignmentIndex) => (
                          <div
                            key={assignment._id}
                            className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded"
                          >
                            <span>{assignment.title}</span>

                            <div className="flex gap-2">
                 

                              <button
                                type="button"
                                onClick={() =>
                                  removeExistingAssignment(idx, assignmentIndex)
                                }
                                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Add New Notes (PDF, multiple)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={(e) =>
                        handleNotesFilesChange(idx, e.target.files)
                      }
                      className="border rounded-lg p-2 w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: {newNotesFiles[idx]?.length || 0}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Add New Assignments (PDF, multiple)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={(e) =>
                        handleAssignmentFilesChange(idx, e.target.files)
                      }
                      className="border rounded-lg p-2 w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: {newAssignmentFiles[idx]?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Subject Group"}
        </button>
      </form>
    </div>
  );
};

export default EditSubject;
