import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { resetPasswordToken } from "../services/authApi";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  function submitHandler(e) {
    e.preventDefault();
    if (email) {
      dispatch(resetPasswordToken(email, setEmailSent));
    }
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white text-black px-6 py-3 rounded-md shadow-lg text-base sm:text-lg font-medium animate-pulse">
            Loading...
          </div>
        </div>
      )}

      <div className="h-screen flex items-center justify-center bg-gray-900 px-4 text-white">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl animate-fade-in transition-all duration-500">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {emailSent ? "Check Your Email" : "Reset Your Password"}
          </h1>

          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            {!emailSent && (
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="p-2 rounded-md bg-gray-700 text-white outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 rounded-md transition-all duration-300"
            >
              {emailSent ? "Resend Email" : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-yellow-400 hover:underline transition-all"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
