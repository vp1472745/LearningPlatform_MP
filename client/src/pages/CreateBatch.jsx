import React from "react";

import BatchForm from "../components/batch/BatchForm";
import StudentUpload from "../components/batch/StudentUpload";
import SubjectList from "../components/subject/SubjectList";

const CreateBatch = () => {
  return (
    <div className="space-y-6">
      <BatchForm />

      <SubjectList />

      <StudentUpload />
    </div>
  );
};

export default CreateBatch;