import React from "react";
import AddCourse from "../AddCourse";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const EditCourse = () => {
  const { courses } = useSelector((state) => state.course);
  const location = useLocation();
  const courseId = location.pathname.split("/").at(-1);
  const courseToEdit = courses.find((course) => course._id === courseId);

  console.log("Editing course:", courseToEdit);

  return <AddCourse course={courseToEdit} />;
};

export default EditCourse;
