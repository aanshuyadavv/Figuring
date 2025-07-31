import React, { useState, useEffect } from "react";
import AddLectureForm from "./courseBuilderForm/AddLectureForm";
import EditLectureForm from "./courseBuilderForm/EditLectureForm";
import { FaPlus } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewSection,
  deleteSection,
  updateSection,
} from "../../../services/sectionApi";
import { deleteSubSection } from "../../../services/subsectionApi";
import { useNavigate } from "react-router-dom";
import { setCurrStep } from "../../../slices/stepsSlice";

const CourseBuilderForm = ({ course }) => {
  const [lectureModal, setLectureModal] = useState(null);
  const [sectionNames, setSectionNames] = useState([]);
  const [toggledSections, setToggledSections] = useState({});
  const [editSection, setEditSection] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editLectureModal, setEditLectureModal] = useState(null);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseData, section, subsection } = useSelector(
    (state) => state.course
  );
  const { _id: courseId } = courseData;
  const subsectionMap = useSelector((state) => state.course.subsection) || {};
  const navigate = useNavigate();
  const { editCourse } = useSelector((state) => state.course);

  useEffect(() => {
    if (editIndex !== null && section[editIndex]) {
      const { sectionName, _id } = section[editIndex];
      console.log("Currently editing section:", sectionName, _id);
    }
  }, [editIndex, section]);

  useEffect(() => {
    if (
      editCourse &&
      course?.courseContent?.length > 0 &&
      (!section || section.length === 0)
    ) {
      dispatch({ type: "course/setSection", payload: course.courseContent });
    }
  }, [editCourse, course, section, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return toast.error("Section name is required");
    const alreadyExists = sectionNames.includes(inputValue.trim());
    if (alreadyExists) return toast.error("Section already exists");

    setSectionNames((prev) => [...prev, inputValue.trim()]);
    dispatch(createNewSection({ sectionName: inputValue, courseId }, token));
    setInputValue("");
  };

  const pencilHandler = (sectionName, index) => {
    setInputValue(sectionName);
    setEditSection(true);
    setEditIndex(index);
  };

  const updateSectionHandler = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return toast.error("Section name is required");

    const duplicate = section.some(
      (sec, i) => sec.sectionName === trimmed && i !== editIndex
    );
    if (duplicate) return toast.error("Section already exists");

    const sectionList = editCourse ? course.courseContent : section;
    const sectionToUpdate = sectionList[editIndex];
    if (!sectionToUpdate) return toast.error("Section not found");

    dispatch(
      updateSection(
        {
          sectionName: trimmed,
          sectionId: sectionToUpdate._id,
          courseId,
        },
        token
      )
    );

    setEditSection(false);
    setInputValue("");
    setEditIndex(null);
  };

  const dltHandler = (index) => {
    const updated = sectionNames.filter((_, i) => i !== index);
    setSectionNames(updated);
    const sectionId = section[index]._id;
    if (!sectionId) return toast.error("Section not found");
    dispatch(deleteSection({ sectionId, courseId }, token));
  };

  const toggleSection = (index) => {
    setToggledSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const dltSubSections = (subSectionId, sectionId) => {
    if (!subSectionId || !sectionId) {
      return toast.error("Subsection ID or Section ID is missing");
    }
    dispatch(deleteSubSection({ subSectionId, sectionId }, token));
  };

  return (
    <div className="text-white px-4 sm:px-6 py-6 sm:py-8 max-w-full md:max-w-4xl mx-auto">
      <h1 className="text-lg font-bold mb-6">Course Builder</h1>

      {/* SECTION FORM */}
      <form
        onSubmit={editSection ? updateSectionHandler : handleSubmit}
        className="bg-gray-900 rounded shadow-md p-4 space-y-4"
      >
        <div>
          <label htmlFor="section" className="block text-sm font-medium mb-1">
            Section Name
          </label>
          <input
            type="text"
            required
            id="section"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded transition"
        >
          {editSection ? "Edit Section" : "Create Section"}
        </button>
      </form>

      {/* SECTION LIST */}
      <div className="bg-gray-800 rounded-md p-4 mt-8 shadow-md">
        {(editCourse ? section : section).map((sec, index) => {
          const subsections = editCourse
            ? sec.subsection || []
            : subsectionMap[sec._id] || [];

          return (
            <div
              key={index}
              className="flex flex-col gap-2 p-2 mb-2 rounded"
            >
              <div className="flex flex-wrap justify-between items-center gap-2">
                <h3 className="font-medium text-base">{sec.sectionName}</h3>
                <div className="flex items-center gap-3 text-gray-400 text-lg">
                  <button
                    onClick={() => pencilHandler(sec.sectionName, index)}
                    title="Edit"
                    className="hover:text-yellow-400"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => dltHandler(index)}
                    title="Delete"
                    className="hover:text-red-500"
                  >
                    <MdDelete />
                  </button>
                  <button
                    onClick={() => toggleSection(index)}
                    className="hover:text-white cursor-pointer"
                  >
                    {toggledSections[index] ? (
                      <IoIosArrowDropup />
                    ) : (
                      <IoIosArrowDropdown />
                    )}
                  </button>
                </div>
              </div>

              {toggledSections[index] && (
                <div className="ml-3 sm:ml-6 text-sm text-gray-300">
                  {subsections.map((sub, subIndex) => (
                    <div
                      key={subIndex}
                      className="flex flex-col sm:flex-row justify-between gap-3 border-b border-gray-600 py-2"
                    >
                      <span>{sub.title}</span>
                      <div className="flex gap-3 text-lg">
                        <button
                          onClick={() =>
                            setEditLectureModal({
                              index,
                              subIndex,
                              sectionId: sec._id,
                              subSectionId: sub._id,
                            })
                          }
                          title="Edit"
                          className="hover:text-yellow-400"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => dltSubSections(sub._id, sec._id)}
                          title="Delete"
                          className="hover:text-red-500"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setLectureModal({ index })}
                    className="text-yellow-400 font-medium hover:underline mt-4 flex items-center gap-2"
                  >
                    <FaPlus /> <span>Add Lecture</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODALS */}
      {(lectureModal || editLectureModal) && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4 sm:px-0 backdrop-blur-sm bg-black bg-opacity-50"
          onClick={() =>
            lectureModal
              ? setLectureModal(null)
              : setEditLectureModal(null)
          }
        >
          <div
            className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() =>
                lectureModal
                  ? setLectureModal(null)
                  : setEditLectureModal(null)
              }
              className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-lg"
            >
              ✕
            </button>

            {lectureModal && (
              <AddLectureForm
                setLectureModal={setLectureModal}
                index={lectureModal.index}
              />
            )}

            {editLectureModal && (
              <EditLectureForm
                sectionId={editLectureModal.sectionId}
                subSectionId={editLectureModal.subSectionId}
                index={editLectureModal.index}
                subIndex={editLectureModal.subIndex}
              />
            )}
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-transparent border border-yellow-500 text-yellow-500 font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-yellow-300 hover:shadow-lg"
        >
          Back
        </button>

        {!editCourse ? (
          section.length > 0 &&
          Object.values(subsection).some((secArr) => secArr.length > 0) && (
            <button
              onClick={() => dispatch(setCurrStep(3))}
              className="px-4 py-2 bg-transparent border border-yellow-500 text-yellow-500 font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-yellow-300 hover:shadow-lg"
            >
              Next
            </button>
          )
        ) : (
          <button
            onClick={() => dispatch(setCurrStep(3))}
            className="px-4 py-2 bg-transparent border border-yellow-500 text-yellow-500 font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-yellow-300 hover:shadow-lg"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseBuilderForm;
