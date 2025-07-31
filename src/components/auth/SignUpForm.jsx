import React, { useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendOtp } from "../../services/authApi";
import { setSignupData } from "../../slices/authSlice";

const SignUpForm = () => {
  const [accountType, setAccountType] = useState("student");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    createPassword: "",
    confirmPassword: "",
  });

  function changeHandler(event) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleClick = (key) => {
    setShowPassword((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const submitHandler = (event) => {
    event.preventDefault();

    dispatch(
      setSignupData({
        accountType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.createPassword,
        confirmPassword: formData.confirmPassword,
      })
    );

    dispatch(sendOtp(formData.email, navigate));
  };

  return (
    <div className="mt-8 w-full max-w-xl mx-auto px-4 sm:px-0">
      {/* Account Type Toggle */}
      <div className="flex flex-wrap justify-center bg-gray-800 rounded-full p-1 gap-2 max-w-max mx-auto">
        {["student", "instructor"].map((type) => (
          <button
            key={type}
            className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
              accountType === type
                ? "bg-gray-900 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setAccountType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-5 mt-8 text-white"
      >
        {/* Name Fields */}
        <div className="flex flex-col md:flex-row gap-4">
          {["firstName", "lastName"].map((field) => (
            <label key={field} className="w-full">
              <p className="mb-1 text-sm text-gray-400">
                {field === "firstName" ? "First Name" : "Last Name"}
                <sup className="text-pink-300">*</sup>
              </p>
              <input
                required
                type="text"
                name={field}
                value={formData[field]}
                onChange={changeHandler}
                placeholder={`Enter ${field === "firstName" ? "first" : "last"} name`}
                className="bg-gray-800 text-white rounded-md w-full px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </label>
          ))}
        </div>

        {/* Email */}
        <label className="w-full">
          <p className="mb-1 text-sm text-gray-400">
            Email Address<sup className="text-pink-300">*</sup>
          </p>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            placeholder="Enter email address"
            className="bg-gray-800 text-white rounded-md w-full px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </label>

        {/* Password Fields */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Create Password */}
          <label className="w-full relative">
            <p className="mb-1 text-sm text-gray-400">
              Create Password<sup className="text-pink-300">*</sup>
            </p>
            <input
              required
              type={showPassword.password ? "text" : "password"}
              name="createPassword"
              value={formData.createPassword}
              onChange={changeHandler}
              placeholder="Enter password"
              className="bg-gray-800 text-white rounded-md w-full px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <span
              className="absolute right-3 top-[45px] text-xl cursor-pointer text-gray-400 hover:text-white"
              onClick={() => handleClick("password")}
            >
              {showPassword.password ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </span>
          </label>

          {/* Confirm Password */}
          <label className="w-full relative">
            <p className="mb-1 text-sm text-gray-400">
              Confirm Password<sup className="text-pink-300">*</sup>
            </p>
            <input
              required
              type={showPassword.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={changeHandler}
              placeholder="Confirm password"
              className="bg-gray-800 text-white rounded-md w-full px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <span
              className="absolute right-3 top-[45px] text-xl cursor-pointer text-gray-400 hover:text-white"
              onClick={() => handleClick("confirmPassword")}
            >
              {showPassword.confirmPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-400 text-black font-semibold rounded-md transition-all duration-200 hover:bg-yellow-300"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
