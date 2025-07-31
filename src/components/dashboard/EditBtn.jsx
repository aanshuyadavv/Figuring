import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";

const EditBtn = () => {
  const navigate = useNavigate();

  const clickHandler = (e) => {
    e.preventDefault();
    navigate("/dashboard/my-settings");
  };

  return (
    <button
      onClick={clickHandler}
      aria-label="Edit Profile Settings"
      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-md shadow-md transition-all duration-200 text-sm sm:text-base"
    >
      <FiEdit className="text-base sm:text-lg" />
      <span className="hidden sm:inline">Edit</span>
    </button>
  );
};

export default EditBtn;
