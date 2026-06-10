  import React, { useState } from 'react';
  import { toast } from 'react-hot-toast';
  import api from '../../utils/api';

  const SubjectForm = ({ onSuccess }) => {
    const [branch, setBranch] = useState('CSE');
    const [semester, setSemester] = useState(1);
    const [subjects, setSubjects] = useState([
      { subjectName: '', subjectCode: '', notesFiles: [], assignmentFiles: [] },
    ]);
    const [loading, setLoading] = useState(false);

    const addSubject = () => {
      setSubjects([...subjects, { subjectName: '', subjectCode: '', notesFiles: [], assignmentFiles: [] }]);
    };

    const removeSubject = (index) => {
      if (subjects.length === 1) {
        toast.error('At least one subject is required');
        return;
      }
      const updated = [...subjects];
      updated.splice(index, 1);
      setSubjects(updated);
    };

    const updateSubject = (index, field, value) => {
      const updated = [...subjects];
      updated[index][field] = value;
      setSubjects(updated);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const validSubjects = subjects.filter(
        (sub) => sub.subjectName.trim() !== '' && sub.subjectCode.trim() !== ''
      );
      if (validSubjects.length === 0) {
        toast.error('Please add at least one subject with name and code');
        return;
      }

      const formData = new FormData();
      formData.append('branch', branch);
      formData.append('semester', String(semester));
      formData.append(
        'subjects',
        JSON.stringify(
          validSubjects.map(({ subjectName, subjectCode }) => ({ subjectName, subjectCode }))
        )
      );

      validSubjects.forEach((subject, idx) => {
        (subject.notesFiles || []).forEach((file) => {
          formData.append(`notes_${idx}`, file);
        });
        (subject.assignmentFiles || []).forEach((file) => {
          formData.append(`assignments_${idx}`, file);
        });
      });

      setLoading(true);
      try {
        await api.post('/subject/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Semester subjects created successfully!');
        // Reset form
        setBranch('CSE');
        setSemester(1);
        setSubjects([{ subjectName: '', subjectCode: '', notesFiles: [], assignmentFiles: [] }]);
        if (onSuccess) onSuccess(); // refresh list if needed
      } catch (error) {
        toast.error(error.response?.data?.message || 'Creation failed');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-5 dark:text-white">Create Semester Subjects</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="border rounded-lg p-3 dark:bg-gray-700 dark:text-white"
            >
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="EE">EE</option>
            </select>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="border rounded-lg p-3 dark:bg-gray-700 dark:text-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {subjects.map((subject, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3 dark:border-gray-700">
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Subject Name"
                  value={subject.subjectName}
                  onChange={(e) => updateSubject(index, 'subjectName', e.target.value)}
                  className="border rounded-lg p-3 dark:bg-gray-700 dark:text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Subject Code"
                  value={subject.subjectCode}
                  onChange={(e) => updateSubject(index, 'subjectCode', e.target.value)}
                  className="border rounded-lg p-3 dark:bg-gray-700 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeSubject(index)}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-2"
                >
                  Remove
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    Notes (PDF, multiple)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={(e) =>
                      updateSubject(index, 'notesFiles', Array.from(e.target.files || []))
                    }
                    className="border rounded-lg p-2 w-full dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {(subject.notesFiles || []).length}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    Assignments (PDF, multiple)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={(e) =>
                      updateSubject(index, 'assignmentFiles', Array.from(e.target.files || []))
                    }
                    className="border rounded-lg p-2 w-full dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {(subject.assignmentFiles || []).length}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSubject}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            + Add Subject
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Save Semester'}
          </button>
        </form>
      </div>
    );
  };

  export default SubjectForm;