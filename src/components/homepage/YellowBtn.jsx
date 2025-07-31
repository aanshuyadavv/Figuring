import React from "react";
import { NavLink } from "react-router-dom";

const YellowBtn = ({ text, path }) => {
  return (
    <NavLink to={path} aria-label={text}>
      <button className="text-xs sm:text-sm border border-yellow-500 px-4 py-2 rounded bg-yellow-300 hover:bg-yellow-400 text-black font-bold transition duration-150 w-full sm:w-auto">
        {text}
      </button>
    </NavLink>
  );
};

export default YellowBtn;
