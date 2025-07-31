import React from "react";
import RenderSteps from "./RenderSteps";
import { useSelector } from "react-redux";

const AddCourse = ({ course }) => {
  const { loading } = useSelector((state) => state.course);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="text-white flex flex-col lg:flex-row justify-between gap-6 p-4 sm:p-6 lg:p-10 w-full">
      {/* Course Form */}
      <div className="w-full lg:w-3/5 border-2 border-gray-700 bg-gray-900 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-yellow-400 text-center">
          Add Course
        </h1>
        <RenderSteps course={course} />
      </div>

      {/* Course Tips */}
      <div className="w-full lg:w-2/5 border-2 border-gray-700 bg-gray-800 p-6 rounded-lg shadow-md text-sm h-fit">
        <h2 className="text-lg font-semibold mb-4 text-yellow-300">
          Course Upload Tips
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Set the Course Price option or make it free.</li>
          <li>Standard thumbnail size is 1024x576.</li>
          <li>Video section controls the course overview video.</li>
          <li>Clearly name all files to avoid confusion.</li>
          <li>Use MP4 format for better compatibility.</li>
          <li>Preview content before submission to catch errors.</li>
          <li>Limit video size to 100MB for faster uploads.</li>
          <li>Include a short description for each lecture video.</li>
        </ul>
      </div>
    </div>
  );
};

export default AddCourse;
