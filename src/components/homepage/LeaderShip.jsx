import React from "react";
import { FaIdBadge } from "react-icons/fa";
import { FcGraduationCap, FcApprove } from "react-icons/fc";
import { IoDiamond } from "react-icons/io5";

const LeaderShip = ({ meet }) => {
  const data = [
    {
      logo: <FaIdBadge />,
      title: "Leadership",
      description: "Fully committed to the success of the company",
    },
    {
      logo: <FcGraduationCap />,
      title: "Responsibility",
      description: "Students will always be our top priority",
    },
    {
      logo: <IoDiamond />,
      title: "Flexibility",
      description: "The ability to switch is an important skill",
    },
    {
      logo: <FcApprove />,
      title: "Solve the problem",
      description: "Code your way to solve a solution",
    },
  ];

  return (
    <div className="w-11/12 max-w-6xl mx-auto mt-10 flex flex-col lg:flex-row items-center justify-between gap-10">
      {/* Left Side - Tags */}
      <div className="flex flex-col gap-6 w-full lg:w-[25rem]">
        {data.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="h-10 w-10 bg-[#eeeef0] rounded-full flex items-center justify-center text-lg">
              {item.logo}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="text-xs text-gray-400">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right Side - Image with Overlay */}
      <div className="relative w-full lg:w-[30rem] h-[18rem]">
        {/* Background Gradient Box */}
        <div className="absolute top-4 left-4 h-full w-full rounded-lg bg-gradient-to-r from-yellow-400 to-pink-500 blur-sm z-0" />

        {/* Main Image */}
        <div className="relative z-10 h-full w-full overflow-hidden rounded-lg shadow-lg">
          <img
            src={meet}
            alt="Meet"
            className="h-full w-full object-cover shadow-lg"
          />
        </div>

        {/* Overlay Stats */}
        <div className="absolute -bottom-24 sm:-bottom-20 left-1/2 transform -translate-x-1/2 bg-green-900 text-white flex flex-col sm:flex-row justify-evenly items-center w-[90%] sm:w-[24rem] px-4 py-4 rounded-md z-20 shadow-md">
          <div className="text-center mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold">10</h2>
            <p className="text-sm text-gray-300 leading-tight">
              Years
              <br />
              Experience
            </p>
          </div>
          <div className="h-[1px] sm:h-12 bg-gray-600 mx-4 sm:mx-4 w-1/2 sm:w-[1px]" />
          <div className="text-center">
            <h2 className="text-2xl font-bold">250</h2>
            <p className="text-sm text-gray-300 leading-tight">
              Types of
              <br />
              Courses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderShip;
