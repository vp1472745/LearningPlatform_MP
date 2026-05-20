import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSave, FaUsers, FaCheckCircle, FaTimesCircle, FaEye, FaSearch, FaTimes } from 'react-icons/fa';

const Attendance = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [savedStatus, setSavedStatus] = useState('');
  const [showPrevious, setShowPrevious] = useState(false);
  const [previousRecords, setPreviousRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load batches from localStorage
  useEffect(() => {
    const storedBatches = JSON.parse(localStorage.getItem('batches') || '[]');
    setBatches(storedBatches);
  }, []);

  // When batch changes, load its students and attendance for the selected date
  useEffect(() => {
    if (!selectedBatch) return;
    const batch = batches.find(b => b.id === selectedBatch);
    if (batch) {
      const studentList = batch.students || [];
      setStudents(studentList);
      const attendanceKey = `attendance_${selectedBatch}_${selectedDate}`;
      const savedAttendance = JSON.parse(localStorage.getItem(attendanceKey) || '{}');
      const initialAttendance = {};
      studentList.forEach((_, idx) => {
        initialAttendance[idx] = savedAttendance[idx] !== undefined ? savedAttendance[idx] : 'present';
      });
      setAttendance(initialAttendance);
      setSearchTerm(''); // reset search when batch changes
    }
  }, [selectedBatch, selectedDate, batches]);

  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
    setShowPrevious(false);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setShowPrevious(false);
  };

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const markAllPresent = () => {
    const newAttendance = {};
    students.forEach((_, idx) => { newAttendance[idx] = 'present'; });
    setAttendance(newAttendance);
  };

  const markAllAbsent = () => {
    const newAttendance = {};
    students.forEach((_, idx) => { newAttendance[idx] = 'absent'; });
    setAttendance(newAttendance);
  };

  const saveAttendance = () => {
    if (!selectedBatch || !selectedDate) {
      setSavedStatus('❌ Please select a batch and date');
      setTimeout(() => setSavedStatus(''), 3000);
      return;
    }
    const attendanceKey = `attendance_${selectedBatch}_${selectedDate}`;
    localStorage.setItem(attendanceKey, JSON.stringify(attendance));
    setSavedStatus(`✅ Attendance saved for ${selectedDate}`);
    setTimeout(() => setSavedStatus(''), 3000);
  };

  const viewPreviousAttendance = () => {
    if (!selectedBatch) return;
    const allKeys = Object.keys(localStorage);
    const batchKeys = allKeys.filter(key => key.startsWith(`attendance_${selectedBatch}_`));
    const records = batchKeys.map(key => {
      const date = key.split('_')[2];
      const data = JSON.parse(localStorage.getItem(key));
      const total = Object.values(data).length;
      const present = Object.values(data).filter(v => v === 'present').length;
      return { date, total, present, absent: total - present };
    }).sort((a,b) => b.date.localeCompare(a.date));
    setPreviousRecords(records);
    setShowPrevious(true);
  };

  // Filter students based on search term (case-insensitive, any field)
  const getFilteredStudents = () => {
    if (!searchTerm.trim()) return students;
    const term = searchTerm.toLowerCase();
    return students.filter(student => {
      return Object.values(student).some(value =>
        String(value).toLowerCase().includes(term)
      );
    });
  };

  const filteredStudents = getFilteredStudents();
  const hasSearch = searchTerm.trim().length > 0;

  // Get dynamic headers from the first student (if any)
  const getStudentKeys = () => {
    if (students.length === 0) return [];
    return Object.keys(students[0]);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <FaUsers className="text-indigo-600 dark:text-indigo-400" /> Attendance Management
        </h1>

        {/* Batch & Date Selection */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Batch</label>
              <select
                value={selectedBatch || ''}
                onChange={handleBatchChange}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl p-2.5"
              >
                <option value="">-- Choose Batch --</option>
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {batch.stream} | {batch.year} | Sem {batch.semester}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl p-2.5"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={viewPreviousAttendance}
                disabled={!selectedBatch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition disabled:opacity-50"
              >
                <FaEye /> View History
              </button>
            </div>
          </div>
        </div>

        {/* Student Attendance Table */}
        {selectedBatch && students.length > 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
            {/* Search Bar and Action Buttons */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, roll number, email, or any field..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={markAllPresent}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                >
                  <FaCheckCircle /> All Present
                </button>
                <button
                  onClick={markAllAbsent}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                >
                  <FaTimesCircle /> All Absent
                </button>
                <button
                  onClick={saveAttendance}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <FaSave /> Save
                </button>
              </div>
            </div>
            {savedStatus && (
              <div className="mx-4 mt-2 p-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-sm">
                {savedStatus}
              </div>
            )}
            {hasSearch && (
              <div className="mx-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredStudents.length} of {students.length} students
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                    {getStudentKeys().map(key => (
                      <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{key}</th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attendance</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredStudents.map((student, displayIdx) => {
                    // Find original index of this student in the full students array
                    const originalIdx = students.findIndex(s => JSON.stringify(s) === JSON.stringify(student));
                    return (
                      <tr key={originalIdx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{displayIdx + 1}</td>
                        {getStudentKeys().map(key => (
                          <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{student[key]}</td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => toggleAttendance(originalIdx)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                              attendance[originalIdx] === 'present'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {attendance[originalIdx] === 'present' ? 'Present' : 'Absent'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={getStudentKeys().length + 2} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No students match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : selectedBatch && students.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 rounded-xl">
            <p className="text-yellow-800 dark:text-yellow-200">No students found for this batch. Please import students in Create Batches page.</p>
          </div>
        ) : null}

        {/* Previous Attendance Modal */}
        {showPrevious && previousRecords.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Attendance History</h3>
                <button onClick={() => setShowPrevious(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  ✕
                </button>
              </div>
              <div className="p-4">
                <table className="min-w-full">
                  <thead>
                    <tr><th className="text-left p-2">Date</th><th className="text-left p-2">Total</th><th className="text-left p-2">Present</th><th className="text-left p-2">Absent</th></tr>
                  </thead>
                  <tbody>
                    {previousRecords.map(rec => (
                      <tr key={rec.date} className="border-b dark:border-gray-700">
                        <td className="p-2">{rec.date}</td>
                        <td className="p-2">{rec.total}</td>
                        <td className="p-2 text-green-600 dark:text-green-400">{rec.present}</td>
                        <td className="p-2 text-red-600 dark:text-red-400">{rec.absent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;