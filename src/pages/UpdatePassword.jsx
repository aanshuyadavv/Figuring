import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authApi";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenFromURL = searchParams.get("token");
    setToken(tokenFromURL);
  }, [location]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(resetPassword(password, confirmPassword, token, navigate));
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white text-black px-6 py-3 rounded-md shadow-lg text-base sm:text-lg font-medium animate-pulse">
            Loading...
          </div>
        </div>
      )}

      <div className="h-screen flex justify-center items-center bg-gray-900 text-white px-4">
        <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-8 animate-fade-in transition-all duration-500">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Choose New Password
          </h1>

          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm text-gray-300">
                New Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-2 rounded-md bg-gray-700 text-white outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-sm text-gray-300"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="p-2 rounded-md bg-gray-700 text-white outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-md transition-all duration-300"
            >
              Reset Password
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

export default UpdatePassword;
