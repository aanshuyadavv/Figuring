import React from "react";
import HighlightText from "./HighlightText";
import YellowBtn from "./YellowBtn";
import { NavLink } from "react-router-dom";

const Card = ({ title1, title2, description, blueTitle, btnText }) => {
  return (
    <div className="text-sm w-[90%] sm:w-full max-w-xl mx-auto p-4 sm:p-6 bg-gray-900 rounded-lg shadow-lg animate-fade-in transition-all duration-500">
      {/* Title */}
      <div className="text-white font-bold text-lg sm:text-xl flex flex-wrap justify-center sm:justify-start gap-1 text-center sm:text-left">
        <span>{title1}</span>
        <HighlightText text={blueTitle} />
        <span>{title2}</span>
      </div>

      {/* Description */}
      <div className="text-gray-400 mt-3 text-center sm:text-left">
        <p>{description}</p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-start justify-center gap-4">
        <YellowBtn text={btnText} path="/" />
        <NavLink to="/">
          <button className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition duration-300">
            Learn More
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default Card;
