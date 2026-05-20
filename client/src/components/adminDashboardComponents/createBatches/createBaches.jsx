import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  FaLayerGroup, FaChalkboard, FaBookOpen, FaUsers, 
  FaFileExcel, FaPlusCircle, FaTrashAlt, FaEdit, 
  FaCloudUploadAlt, FaUserMinus, FaSyncAlt, FaCheckCircle,
  FaInfoCircle, FaUpload, FaLightbulb, FaFilePdf, FaFileAlt,
  FaGraduationCap, FaEye, FaTimes, FaSave, FaMoon, FaSun,
  FaPlus, FaTrash
} from 'react-icons/fa';

// Toast notification component
const Toast = ({ message, onClose, type = 'success' }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  return (
    <div className={`fixed bottom-6 right-6 ${bgColor} text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50 flex items-center gap-2 animate-slide-up`}>
      {type === 'success' && <FaCheckCircle />}
      {type === 'error' && <FaTimes />}
      {message}
    </div>
  );
};

// Main Modal for Full Details
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto animate-modal-pop">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <FaTimes size={22} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Custom Confirmation Modal
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-modal-pop">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition">Delete</button>
        </div>
      </div>
    </div>
  );
};

const BatchManager = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Batch state
  const [stream, setStream] = useState('CSE');
  const [year, setYear] = useState('2024-25');
  const [semester, setSemester] = useState('1');

  // Subjects state - each subject has arrays of files
  const [subjects, setSubjects] = useState([
    { name: 'Data Structures', pdfFiles: [], assignmentFiles: [] },
    { name: 'Digital Electronics', pdfFiles: [], assignmentFiles: [] }
  ]);

  // Students state
  const [students, setStudents] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');
  
  // Submitted batch summary
  const [submittedBatch, setSubmittedBatch] = useState(null);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const showToast = (msg, type = 'success') => {
    setToastType(type);
    setToastMsg(msg);
  };

  const getBatchPreview = () => `${stream}, Year: ${year}, Sem ${semester}`;

  // Subject handlers
  const addSubject = () => {
    setSubjects(prev => [...prev, { name: `Subject ${prev.length + 1}`, pdfFiles: [], assignmentFiles: [] }]);
    showToast('➕ New subject added', 'success');
  };

  const updateSubjectName = (idx, newName) => {
    setSubjects(prev => prev.map((sub, i) => i === idx ? { ...sub, name: newName } : sub));
  };

  const deleteSubject = (idx) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Subject',
      message: `Are you sure you want to delete "${subjects[idx].name}"?`,
      onConfirm: () => {
        setSubjects(prev => prev.filter((_, i) => i !== idx));
        showToast('🗑️ Subject removed', 'success');
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // File handling for multiple files
  const addFileToSubject = (idx, type, file) => {
    if (!file) return;
    const fileMeta = { name: file.name, fileObj: file, id: Date.now() + Math.random() };
    setSubjects(prev => prev.map((sub, i) => {
      if (i !== idx) return sub;
      return {
        ...sub,
        [type === 'pdf' ? 'pdfFiles' : 'assignmentFiles']: [...sub[type === 'pdf' ? 'pdfFiles' : 'assignmentFiles'], fileMeta]
      };
    }));
    showToast(`${type === 'pdf' ? '📄 PDF' : '📋 Assignment'} "${file.name}" added`, 'success');
  };

  const removeFileFromSubject = (idx, type, fileId) => {
    setSubjects(prev => prev.map((sub, i) => {
      if (i !== idx) return sub;
      return {
        ...sub,
        [type === 'pdf' ? 'pdfFiles' : 'assignmentFiles']: sub[type === 'pdf' ? 'pdfFiles' : 'assignmentFiles'].filter(f => f.id !== fileId)
      };
    }));
    showToast('File removed', 'success');
  };

  const triggerFileInput = (idx, type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'pdf' ? '.pdf,application/pdf' : '.pdf,.doc,.docx,.txt,.zip';
    input.multiple = false;
    input.onchange = (e) => {
      if (e.target.files[0]) addFileToSubject(idx, type, e.target.files[0]);
    };
    input.click();
  };

  // Excel import
  const handleExcelUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet);
      if (!rows.length) {
        showToast('⚠️ Excel file has no data rows.', 'error');
        return;
      }
      const newStudents = rows.map((row, idx) => ({
        id: Date.now() + idx + Math.random(),
        rowData: { ...row }
      }));
      setStudents(prev => [...prev, ...newStudents]);
      showToast(`✅ Imported ${rows.length} student records.`, 'success');
    };
    reader.readAsArrayBuffer(file);
  };

  const removeStudent = (idxToRemove) => {
    setStudents(prev => prev.filter((_, idx) => idx !== idxToRemove));
    showToast('Student removed', 'success');
  };

  const clearAllStudents = () => {
    if (students.length === 0) {
      showToast('No students to clear', 'error');
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Students',
      message: 'Are you sure you want to remove ALL students from this batch? This action cannot be undone.',
      onConfirm: () => {
        setStudents([]);
        showToast('All students cleared', 'success');
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const getAllStudentKeys = () => {
    const keysSet = new Set();
    students.forEach(s => {
      if (s.rowData && typeof s.rowData === 'object') {
        Object.keys(s.rowData).forEach(k => keysSet.add(k));
      }
    });
    return Array.from(keysSet);
  };

  // Submit batch handler with localStorage persistence
  const handleSubmitBatch = () => {
    const batchData = {
      stream,
      year,
      semester,
      subjects: subjects.map(sub => ({
        name: sub.name,
        pdfFiles: sub.pdfFiles.map(f => f.name),
        assignmentFiles: sub.assignmentFiles.map(f => f.name)
      })),
      students: students.map(s => s.rowData),
      studentCount: students.length,
      submittedAt: new Date().toLocaleString()
    };
    setSubmittedBatch(batchData);
    
    // Save batch to localStorage for Attendance page
    const batchId = `${stream}|${year}|${semester}`;
    const existingBatches = JSON.parse(localStorage.getItem('batches') || '[]');
    const existingIndex = existingBatches.findIndex(b => b.id === batchId);
    const newBatch = {
      id: batchId,
      stream,
      year,
      semester,
      subjects: batchData.subjects,
      students: batchData.students,
      createdAt: new Date().toISOString()
    };
    if (existingIndex >= 0) {
      existingBatches[existingIndex] = newBatch;
    } else {
      existingBatches.push(newBatch);
    }
    localStorage.setItem('batches', JSON.stringify(existingBatches));
    
    showToast('✅ Batch submitted! Summary card created below.', 'success');
  };

  const renderModalContent = () => {
    if (!submittedBatch) return null;
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 p-4 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">📋 Batch Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>Stream:</strong> {submittedBatch.stream}</p>
            <p><strong>Year:</strong> {submittedBatch.year}</p>
            <p><strong>Semester:</strong> {submittedBatch.semester}</p>
            <p><strong>Submitted:</strong> {submittedBatch.submittedAt}</p>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">📚 Subjects ({submittedBatch.subjects.length})</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr><th className="p-3 text-left text-gray-800 dark:text-gray-200">Subject Name</th><th className="p-3 text-left text-gray-800 dark:text-gray-200">PDF Files</th><th className="p-3 text-left text-gray-800 dark:text-gray-200">Assignment Files</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {submittedBatch.subjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{sub.name}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">{sub.pdfFiles.length ? sub.pdfFiles.join(', ') : 'None'}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">{sub.assignmentFiles.length ? sub.assignmentFiles.join(', ') : 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">👩‍🎓 Students ({submittedBatch.studentCount})</h4>
          {submittedBatch.studentCount === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic">No students added.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr><th className="p-3 text-gray-800 dark:text-gray-200">#</th>{Object.keys(submittedBatch.students[0] || {}).map(key => <th key={key} className="p-3 text-gray-800 dark:text-gray-200">{key}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {submittedBatch.students.map((student, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-3 text-gray-800 dark:text-gray-200">{idx+1}</td>
                      {Object.values(student).map((val, i) => <td key={i} className="p-3 text-gray-600 dark:text-gray-400">{val ?? '—'}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen transition-colors duration-300">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} type={toastType} />}
      
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Batch Full Details">
        {renderModalContent()}
      </Modal>

      {/* Header with theme toggle */}
      <div className="text-center mb-12 relative">
        <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-full shadow-md mb-3">
          <FaLayerGroup className="text-4xl text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-indigo-800 dark:from-slate-200 dark:to-indigo-400 bg-clip-text text-transparent">
          Batch Manager Pro
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 px-4">Create batches → Add subjects with resources (multiple PDFs/Assignments) → Import students via Excel</p>
      </div>

      {/* Batch Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-8">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
          <FaChalkboard className="text-indigo-500 dark:text-indigo-400 text-2xl" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Batch Configuration</h2>
          <span className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-3 py-1 rounded-full">Select & Build</span>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-5 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><FaGraduationCap className="inline mr-1" /> Stream</label>
            <select value={stream} onChange={(e) => setStream(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition">
              <option value="CSE">CSE (Computer Science)</option>
              <option value="ECE">ECE (Electronics & Comm)</option>
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><FaGraduationCap className="inline mr-1" /> Year</label>
            <input type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g., 1st Year / 2024" className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-200" />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><FaGraduationCap className="inline mr-1" /> Semester</label>
            <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-200">
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 p-3 rounded-xl text-sm text-gray-700 dark:text-gray-300">
          <FaInfoCircle className="inline mr-1" /> Batch identity: <strong>{getBatchPreview()}</strong>
        </div>
      </div>

      {/* Subjects Manager with Multiple Files */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-3 border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <FaBookOpen className="text-indigo-500 dark:text-indigo-400 text-2xl" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Subjects & Resources (Multiple Files)</h2>
          </div>
          <button onClick={addSubject} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm flex items-center gap-2 shadow-md transition-all hover:scale-105">
            <FaPlusCircle /> Add Subject
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
              <tr><th className="p-3 text-left rounded-l-lg">Subject Name</th><th className="p-3 text-left">PDF Materials (Multiple)</th><th className="p-3 text-left">Assignments (Multiple)</th><th className="p-3 w-16 rounded-r-lg">Actions</th></tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr><td colSpan="4" className="text-center p-8 text-gray-400 dark:text-gray-500">➕ Click "Add Subject" to create subjects. </td></tr>
              ) : (
                subjects.map((sub, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="p-2">
                      <input type="text" value={sub.name} onChange={(e) => updateSubjectName(idx, e.target.value)} className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-xl px-3 py-1.5 w-44 focus:ring-2 focus:ring-indigo-200" />
                    </td>
                    {/* PDF Files Column */}
                    <td className="p-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap gap-1">
                          {sub.pdfFiles.map(file => (
                            <span key={file.id} className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                              <FaFilePdf className="text-red-500" />
                              <span className="max-w-[100px] truncate">{file.name}</span>
                              <button onClick={() => removeFileFromSubject(idx, 'pdf', file.id)} className="text-red-500 hover:text-red-700 ml-1">
                                <FaTrash size={10} />
                              </button>
                            </span>
                          ))}
                          {sub.pdfFiles.length === 0 && <span className="text-xs text-gray-400">No PDFs</span>}
                        </div>
                        <button onClick={() => triggerFileInput(idx, 'pdf')} className="text-xs bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-full px-3 py-1 w-fit flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition mt-1">
                          <FaPlus /> Add PDF
                        </button>
                      </div>
                    </td>
                    {/* Assignment Files Column */}
                    <td className="p-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap gap-1">
                          {sub.assignmentFiles.map(file => (
                            <span key={file.id} className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                              <FaFileAlt className="text-blue-500" />
                              <span className="max-w-[100px] truncate">{file.name}</span>
                              <button onClick={() => removeFileFromSubject(idx, 'assignment', file.id)} className="text-red-500 hover:text-red-700 ml-1">
                                <FaTrash size={10} />
                              </button>
                            </span>
                          ))}
                          {sub.assignmentFiles.length === 0 && <span className="text-xs text-gray-400">No assignments</span>}
                        </div>
                        <button onClick={() => triggerFileInput(idx, 'assignment')} className="text-xs bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-full px-3 py-1 w-fit flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition mt-1">
                          <FaPlus /> Add Assignment
                        </button>
                      </div>
                    </td>
                    <td className="p-2">
                      <button onClick={() => deleteSubject(idx)} className="text-red-500 hover:text-red-700 transition p-1">
                        <FaTrashAlt size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl text-xs text-gray-600 dark:text-gray-400">
          <FaUpload className="inline mr-1" /> Add multiple PDFs and assignments per subject. Click + to add more files. Files stored in browser memory.
        </div>
      </div>

      {/* Excel Import + Student Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-8">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
          <FaUsers className="text-indigo-500 dark:text-indigo-400 text-2xl" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Student List (Batch Enrollment)</h2>
          <FaFileExcel className="text-green-700 dark:text-green-400 text-2xl" />
        </div>
        <div className="flex flex-wrap gap-3 mb-5">
          <label className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105">
            <FaUpload /> 📂 Import Excel (.xlsx, .xls)
            <input type="file" accept=".xlsx, .xls, .csv" onChange={(e) => e.target.files[0] && handleExcelUpload(e.target.files[0])} className="hidden" />
          </label>
          <button onClick={clearAllStudents} className="border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-full text-sm flex items-center gap-1 hover:bg-red-100 dark:hover:bg-red-900/50 transition">Clear All Students</button>
          <span className="text-xs text-gray-500 dark:text-gray-400 self-center"><FaInfoCircle className="inline" /> Supports any sheet, dynamic columns.</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr><th className="p-2 text-left text-gray-700 dark:text-gray-300">#</th><th className="p-2 text-left text-gray-700 dark:text-gray-300">Student Details {students.length ? `(${getAllStudentKeys().join(' | ')})` : ''}</th><th className="p-2 w-24 text-gray-700 dark:text-gray-300">Action</th></tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan="3" className="text-center p-8 text-gray-400 dark:text-gray-500">📭 No students imported. Upload an Excel file. Ruining</td></tr>
              ) : (
                students.map((student, idx) => {
                  const keys = getAllStudentKeys();
                  return (
                    <tr key={student.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-2 text-gray-800 dark:text-gray-200">{idx+1}</td>
                      <td className="p-2 text-gray-700 dark:text-gray-300">
                        {keys.length === 0 ? JSON.stringify(student.rowData) : keys.map(k => <span key={k} className="mr-3"><strong>{k}:</strong> {student.rowData[k] ?? '—'}</span>)}
                      </td>
                      <td className="p-2"><button onClick={() => removeStudent(idx)} className="text-red-500 hover:text-red-700 transition"><FaUserMinus /> Remove</button></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-xl text-xs text-gray-700 dark:text-gray-300"><FaLightbulb className="inline mr-1" /> Excel rows appended to batch. Remove students individually.</div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mb-8">
        <button onClick={handleSubmitBatch} className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-8 py-3 rounded-full flex items-center gap-3 shadow-lg transition-all hover:scale-105 font-semibold">
          <FaSave size={18} /> Submit Batch
        </button>
      </div>

      {/* Submitted Summary Card */}
      {submittedBatch && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-4 sm:p-6 mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-3 border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-emerald-500 text-2xl" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Submitted Batch Summary</h2>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm flex items-center gap-2 shadow transition-all hover:scale-105">
              <FaEye /> View Full Details
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="text-gray-700 dark:text-gray-300">
              <p><strong>Stream:</strong> {submittedBatch.stream}</p>
              <p><strong>Year:</strong> {submittedBatch.year}</p>
              <p><strong>Semester:</strong> {submittedBatch.semester}</p>
              <p><strong>Submitted:</strong> {submittedBatch.submittedAt}</p>
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <p><strong>Total Subjects:</strong> {submittedBatch.subjects.length}</p>
              <p><strong>Total Students:</strong> {submittedBatch.studentCount}</p>
              <p><strong>Subjects List:</strong> {submittedBatch.subjects.map(s => s.name).join(', ')}</p>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
            Click "View Full Details" to see all subjects with their multiple PDFs and assignment files.
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes modal-pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-modal-pop { animation: modal-pop 0.2s ease-out; }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default BatchManager;