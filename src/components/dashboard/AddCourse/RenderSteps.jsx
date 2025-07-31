import React from "react";
import { useSelector } from "react-redux";

import CourseInformationForm from "./CourseInformationForm";
import CourseBuilderForm from "./CourseBuilderForm";
import PublishCourseForm from "./publishCourseForm/PublishCourseForm";

const RenderSteps = ({ course }) => {
  const { currStep } = useSelector((state) => state.steps);

  const steps = [
    { id: 1, label: "Course Info" },
    { id: 2, label: "Course Builder" },
    { id: 3, label: "Publish Course" },
  ];

  return (
    <div className="text-white w-full px-4 sm:px-8 py-8">
      {/* Stepper */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex justify-center items-center font-semibold text-sm ${
                  currStep === step.id
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-800 text-gray-400 border border-gray-600"
                }`}
              >
                {step.id}
              </div>
              <p
                className={`mt-2 text-sm text-center ${
                  currStep === step.id ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="hidden sm:block w-24 h-0.5 bg-gray-600 mx-4"></div>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Step Renderer */}
      {currStep === 1 && <CourseInformationForm course={course} />}
      {currStep === 2 && <CourseBuilderForm course={course} />}
      {currStep === 3 && <PublishCourseForm course={course} />}
    </div>
  );
};

export default RenderSteps;
