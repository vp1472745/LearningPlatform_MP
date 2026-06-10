import React from "react";

const StudentProfile = () => {
const student = JSON.parse(
  localStorage.getItem("user")
);
  return (
    <div className="max-w-3xl mx-auto">

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-5">
          My Profile
        </h2>

        <div className="space-y-3">

          <p>
            <strong>Name:</strong>
            {" "}
            {student?.firstName}
            {" "}
            {student?.lastName}
          </p>

          <p>
            <strong>Email:</strong>
            {" "}
            {student?.email}
          </p>

          <p>
            <strong>Username:</strong>
            {" "}
            {student?.username}
          </p>

          <p>
            <strong>Mobile:</strong>
            {" "}
            {student?.mobile}
          </p>

          <p>
            <strong>Branch:</strong>
            {" "}
            {student?.branch}
          </p>

          <p>
            <strong>Semester:</strong>
            {" "}
            {student?.semester}
          </p>

        </div>

      </div>
    </div>
  );
};

export default StudentProfile;