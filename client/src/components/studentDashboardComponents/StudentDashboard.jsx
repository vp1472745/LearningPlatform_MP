import React, { useEffect, useState } from "react";
import api from "../../utils/api";

const StudentDashboard = () => {
  const student = JSON.parse(localStorage.getItem("user") || "{}");

  const [batch, setBatch] = useState(null);
  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);

  // FETCH BATCH
  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await api.get(`/batch/${student?.batchId}`);
        setBatch(res.data.data || res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (student?.batchId) fetchBatch();
  }, [student?.batchId]);

  // FETCH SUBJECTS
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get(
          `/subject/student?branch=${student?.branch?.toUpperCase()}&batchId=${student?.batchId}`
        );

        console.log("Subject Data:", res.data);

        setSubjectData(res.data.data || null);
      } catch (err) {
        console.log(err);
        setSubjectData(null);
      } finally {
        setLoading(false);
      }
    };

    if (student?.branch && student?.semester) {
      fetchSubjects();
    } else {
      setLoading(false);
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

      <h1 className="text-3xl font-bold mb-6">
        Student Dashboard
      </h1>

      {/* STUDENT INFO */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-bold text-lg mb-3">
          Student Info
        </h2>

        <p>
          Name: {student?.firstName} {student?.lastName}
        </p>
        <p>Email: {student?.email}</p>
        <p>Branch: {student?.branch}</p>
        <p>Semester: {student?.semester}</p>
      </div>

   

      {/* SUBJECTS */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-bold text-lg mb-3">
          Subjects
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : subjectData?.subjects?.length > 0 ? (
          subjectData.subjects.map((sub) => (
            <div
              key={sub._id}
              className="border rounded-lg p-4 mb-4"
            >

              {/* SUBJECT HEADER */}
              <h3 className="font-semibold text-lg mb-2">
                {sub.subjectName} ({sub.subjectCode})
              </h3>

              {/* NOTES */}
              <div className="mb-3">
                <p className="font-medium mb-1">
                  📘 Notes
                </p>

                {sub.notes?.length > 0 ? (
                  sub.notes.map((n) => (
                    <button
                      key={n._id}
                      onClick={() =>
                        openPdf(n.pdfUrl, n.title)
                      }
                      className="block text-blue-600 text-sm hover:underline text-left"
                    >
                      📄 {n.title}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    No notes available
                  </p>
                )}
              </div>

              {/* ASSIGNMENTS */}
              <div>
                <p className="font-medium mb-1">
                  📝 Assignments
                </p>

                {sub.assignments?.length > 0 ? (
                  sub.assignments.map((a) => (
                    <button
                      key={a._id}
                      onClick={() =>
                        openPdf(a.pdfUrl, a.title)
                      }
                      className="block text-green-600 text-sm hover:underline text-left"
                    >
                      📎 {a.title}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    No assignments available
                  </p>
                )}
              </div>

            </div>
          ))
        ) : (
          <p>No subjects found for this semester</p>
        )}
      </div>

      {/* PDF MODAL */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">
                {selectedPdf.title}
              </h3>

              <button
                onClick={closePdf}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Close
              </button>
            </div>

            {/* PDF VIEWER */}
            <div className="flex-1 p-2">
              <iframe
                src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                  selectedPdf.url
                )}`}
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