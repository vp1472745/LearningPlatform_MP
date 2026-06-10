import React, { useEffect, useState } from "react";

const StudentDashboard = () => {
  const student = JSON.parse(localStorage.getItem("user") || "{}");

  const [batch, setBatch] = useState(null);
  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null); // { url, title }

  // FETCH BATCH
  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/batch/${student?.batchId}`
        );
        const data = await res.json();
        setBatch(data.data || data);
      } catch (err) {
        console.log(err);
      }
    };

    if (student?.batchId) fetchBatch();
  }, [student?.batchId]);

  // FETCH SUBJECTS (BASED ON SEM + BRANCH)
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/subject/student?branch=${student?.branch}&semester=${student?.semester}`
        );
        const data = await res.json();
        setSubjectData(data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (student?.branch && student?.semester) {
      fetchSubjects();
    }
  }, [student?.branch, student?.semester]);

  const openPdf = (url, title) => {
    setSelectedPdf({ url, title });
  };

  const closePdf = () => {
    setSelectedPdf(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      {/* STUDENT INFO */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-bold text-lg mb-3">Student Info</h2>
        <p>Name: {student?.firstName} {student?.lastName}</p>
        <p>Email: {student?.email}</p>
        <p>Branch: {student?.branch}</p>
        <p>Semester: {student?.semester}</p>
      </div>

      {/* BATCH INFO */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-bold text-lg mb-3">Batch Info</h2>
        <p>Session: {batch?.session}</p>
        <p>Branch: {batch?.branch}</p>
        <p>Semester: {batch?.semester}</p>
      </div>

      {/* SUBJECTS */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-bold text-lg mb-3">Subjects</h2>

        {loading ? (
          <p>Loading...</p>
        ) : subjectData?.subjects?.length > 0 ? (
          subjectData.subjects.map((sub) => (
            <div key={sub._id} className="border rounded-lg p-4 mb-4">
              {/* SUBJECT HEADER */}
              <h3 className="font-semibold text-lg mb-2">
                {sub.subjectName} ({sub.subjectCode})
              </h3>

              {/* NOTES SECTION */}
              <div className="mb-3">
                <p className="font-medium mb-1">📘 Notes</p>
                {sub.notes?.length > 0 ? (
                  sub.notes.map((n) => (
                    <button
                      key={n._id}
                      onClick={() => openPdf(n.pdfUrl, n.title)}
                      className="block text-blue-600 text-sm hover:underline text-left"
                    >
                      📄 {n.title}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No notes available</p>
                )}
              </div>

              {/* ASSIGNMENTS SECTION */}
              <div>
                <p className="font-medium mb-1">📝 Assignments</p>
                {sub.assignments?.length > 0 ? (
                  sub.assignments.map((a) => (
                    <button
                      key={a._id}
                      onClick={() => openPdf(a.pdfUrl, a.title)}
                      className="block text-green-600 text-sm hover:underline text-left"
                    >
                      📎 {a.title}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No assignments available</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No subjects found for this semester</p>
        )}
      </div>

      {/* PDF PREVIEW MODAL */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">{selectedPdf.title}</h3>
              <button
                onClick={closePdf}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Close
              </button>
            </div>
            <div className="flex-1 p-2">
              <iframe
                src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(selectedPdf.url)}`}
                width="100%"
                height="100%"
                title="PDF Viewer"
                className="border rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;