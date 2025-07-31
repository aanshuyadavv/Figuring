import React from "react";
import { FcGoogle } from "react-icons/fc";
import SignUpForm from "../auth/SignUpForm";
import LoginForm from "../auth/LoginForm";

const Template = ({ title, description1, description2, image, frame, formType }) => {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between w-11/12 max-w-[1160px] py-12 mx-auto gap-y-12 lg:gap-x-16 text-gray-100 transition-all duration-300 ease-in-out">
      
      {/* Left Section - Form */}
      <div className="w-full max-w-[450px] flex flex-col gap-6">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-snug">
          {title}
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg leading-6">
          <span className="text-gray-400">{description1}</span>
          <span className="text-blue-500 italic"> {description2}</span>
        </p>

        {/* Conditional Form */}
        {formType === "login" ? <LoginForm /> : <SignUpForm />}

        {/* Divider */}
        <div className="flex items-center gap-x-2 my-6 w-full">
          <div className="h-[1px] w-full bg-gray-700" />
          <p className="uppercase text-sm text-gray-500 font-medium">or</p>
          <div className="h-[1px] w-full bg-gray-700" />
        </div>

        {/* Google Sign-In */}
        <button
          type="button"
          className="flex items-center justify-center gap-3 py-2 px-4 border border-gray-700 rounded-md hover:bg-gray-800 transition-all text-sm font-medium"
        >
          <FcGoogle size={20} />
          Sign in with Google
        </button>
      </div>

      {/* Right Section - Images */}
      <div className="relative w-full max-w-[450px]">
        {/* Background Frame */}
        <img
          src={frame}
          alt="Frame"
          className="w-full object-contain"
          loading="lazy"
        />
        {/* Foreground Image */}
        <img
          src={image}
          alt="Main Visual"
          className="absolute -top-4 right-4 w-[95%] object-contain rounded-md shadow-md"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Template;
