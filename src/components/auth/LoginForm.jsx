import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../services/authApi";
import toast from "react-hot-toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(login(formData.email, formData.password, navigate));
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col gap-6 mt-8 w-full max-w-md mx-auto px-4 sm:px-0 text-white"
    >
      {/* Email Field */}
      <label className="w-full">
        <p className="text-sm text-gray-400 mb-1">
          Email Address <sup className="text-pink-300">*</sup>
        </p>
        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={changeHandler}
          placeholder="Enter your email"
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </label>

      {/* Password Field */}
      <label className="w-full relative">
        <p className="text-sm text-gray-400 mb-1">
          Password <sup className="text-pink-300">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={changeHandler}
          placeholder="Enter your password"
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[45px] text-xl text-gray-400 cursor-pointer"
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </span>
        <Link to="/forgot-password">
          <p className="text-xs mt-1 text-blue-400 hover:text-blue-300 text-right">
            Forgot Password?
          </p>
        </Link>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-yellow-400 text-black font-semibold rounded-md transition-all duration-200 hover:bg-yellow-300"
      >
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
