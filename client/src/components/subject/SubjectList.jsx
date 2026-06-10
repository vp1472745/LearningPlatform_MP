import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const SubjectList = ({ refresh }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/subject');
      setSubjects(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load subjects');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [refresh]);

  const deleteSubject = async (id) => {
    if (!window.confirm('Permanently delete this subject group? All files will be removed.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/subject/${id}`);
      toast.success('Deleted successfully');
      fetchSubjects();
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const openFile = (file) => {
    if (!file?.pdfUrl) {
      toast.error('File URL not found');
      return;
    }
    setSelectedPdf(file.pdfUrl);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
        <h2 className="text-2xl font-bold dark:text-white">Semester Subjects</h2>
        <Link
          to="/subject-master/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Create New
        </Link>
      </div>

      {selectedPdf && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg dark:text-white">PDF Preview</h3>
            <button
              onClick={() => setSelectedPdf('')}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
          <iframe
            src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(selectedPdf)}`}
            width="100%"
            height="600"
            title="PDF Viewer"
            className="border rounded"
          />
        </div>
      )}

      {loading && <div className="text-center py-10 text-gray-500">Loading...</div>}

      {!loading && subjects.length === 0 && (
        <div className="text-center py-10 text-gray-500">No Subjects Found</div>
      )}

      {subjects.map((item) => (
        <div key={item._id} className="border rounded-lg p-4 mb-5 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-xl dark:text-white">{item.branch}</h3>
              <p className="text-gray-600 dark:text-gray-300">Semester : {item.semester}</p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/subject-master/edit/${item._id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteSubject(item._id)}
                disabled={deletingId === item._id}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {deletingId === item._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-3 border">Subject</th>
                  <th className="p-3 border">Code</th>
                  <th className="p-3 border">Notes</th>
                  <th className="p-3 border">Assignments</th>
                </tr>
              </thead>
              <tbody>
                {item.subjects?.map((sub) => (
                  <tr key={sub._id}>
                    <td className="p-3 border">{sub.subjectName}</td>
                    <td className="p-3 border">{sub.subjectCode}</td>
                    <td className="p-3 border">
                      {sub.notes?.length > 0 ? (
                        sub.notes.map((note) => (
                          <div key={note._id} className="mb-2">
                            <p className="font-medium text-sm">{note.title}</p>
                            <button
                              onClick={() => openFile(note)}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View PDF
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">No Notes</span>
                      )}
                    </td>
                    <td className="p-3 border">
                      {sub.assignments?.length > 0 ? (
                        sub.assignments.map((assign) => (
                          <div key={assign._id} className="mb-2">
                            <p className="font-medium text-sm">{assign.title}</p>
                            <button
                              onClick={() => openFile(assign)}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View PDF
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">No Assignments</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubjectList;