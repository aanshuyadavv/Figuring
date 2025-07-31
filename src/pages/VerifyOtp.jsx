import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signup } from "../services/authApi";
import { Link, useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { loading, signupData } = useSelector((state) => state.auth);

  const submitHandler = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    dispatch(
      signup(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  const resendHandler = () => {
    dispatch(sendOtp(email, navigate));
  };

  return (
    <>
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="h-16 w-16 border-4 border-yellow-400 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white px-4">
        <div className="bg-gray-800 w-full max-w-md p-8 rounded-lg shadow-lg animate-fade-in">
          <h1 className="text-2xl font-bold text-center mb-6">
            Verify Your Email
          </h1>

          <form
            onSubmit={submitHandler}
            className="flex flex-col items-center gap-6"
          >
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span className="mx-1 text-lg">-</span>}
              renderInput={(props) => (
                <input
                  {...props}
                  className="w-10 h-10 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center text-lg transition-all duration-300"
                />
              )}
              shouldAutoFocus
              inputType="tel"
            />

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-md transition-all"
            >
              Verify Email
            </button>
          </form>

          <div className="flex justify-between items-center mt-6 text-sm">
            <Link
              to="/login"
              className="text-yellow-400 hover:underline transition-all"
            >
              Back to Login
            </Link>
            <button
              onClick={resendHandler}
              className="text-yellow-400 hover:underline ml-4"
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;
