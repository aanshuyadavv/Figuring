import React, { useState } from "react";
import HighlightText from "./HighlightText";
import { HomePageExplore as exploreData } from "../../data/HomePageExplore";

const HomePageExplore = () => {
  const tags = ["Free", "Paid", "Trending", "Top Rated", "Recently Added"];

  const [currTag, setCurrTag] = useState(exploreData[0].tag);
  const [courses, setCourses] = useState(exploreData[0].courses);
  const [activeTab, setActiveTab] = useState(exploreData[0].tag);
  const [activeCard, setActiveCard] = useState(exploreData[0].courses[0]);

  function setCard(tag) {
    const result = exploreData.find((obj) => obj.tag === tag);
    if (!result || result.courses.length === 0) {
      setCourses([]);
      setActiveCard(null);
    } else {
      setCourses(result.courses);
      setActiveCard(result.courses[0]);
    }
    setCurrTag(tag);
    setActiveTab(tag);
  }

  function cardActive(course) {
    setActiveCard(course);
  }

  return (
    <div className="w-11/12 max-w-max mx-auto mt-12 relative">
      {/* Heading */}
      <div className="text-white flex justify-center items-center mb-3 text-2xl font-semibold text-center flex-wrap">
        <p className="mr-2">Unlock the</p>
        <HighlightText text={"Power of Code"} />
      </div>

      {/* Subtext */}
      <div className="text-center text-gray-400 mb-6">
        <p>Learn to build anything you can imagine</p>
      </div>

      {/* Tabs */}
      <nav
        className="flex justify-center items-center gap-2 flex-wrap p-2"
        role="tablist"
      >
        {tags.map((tag, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeTab === tag}
            className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium
              ${
                activeTab === tag
                  ? "bg-gray-800 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            onClick={() => setCard(tag)}
          >
            {tag}
          </button>
        ))}
      </nav>

      {/* Course Cards */}
      <div className="mt-6 flex flex-wrap justify-center items-stretch gap-4 min-h-[200px]">
        {courses.length === 0 ? (
          <p className="text-white text-lg text-center">
            No courses available for "{currTag}"
          </p>
        ) : (
          courses.map((course, index) => (
            <div
              key={index}
              className={`w-full sm:w-[45%] md:w-[30%] lg:w-[23%] h-44 p-5 rounded-md transition-transform duration-200 cursor-pointer 
                ${
                  activeCard?.heading === course.heading
                    ? "bg-white text-black shadow-[5px_5px_10px_#FACC15]"
                    : "bg-gray-800 text-white hover:scale-[1.02]"
                }`}
              onClick={() => cardActive(course)}
            >
              <div>
                <h5 className="mb-2 text-md font-bold">{course.heading}</h5>
                <p className="mb-3 text-gray-400 text-sm line-clamp-3">
                  {course.description}
                </p>
              </div>
              <div className="flex justify-between text-xs mt-auto pt-2 border-t border-gray-700">
                <p>{course.level}</p>
                <p>{course.lessonNumber} lessons</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePageExplore;
