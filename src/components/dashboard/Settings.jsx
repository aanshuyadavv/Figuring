import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { setProfileImage } from "../../services/authApi";
import {
  updateProfile,
  deleteProfile,
  resetProfilePassword,
} from "../../services/authApi";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setLoading } from "../../slices/authSlice";
import { apiconnector } from "../../services/apiConnector";
import toast from "react-hot-toast";
import { useEffect } from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  // console.log("user", user);
  const [image, setImage] = useState("");
  // console.log("image", image);
  const { loading, token } = useSelector((state) => state.auth);
  // console.log("token", token);
  const { firstName, lastName } = user || {};
  const { gender, dateOfBirth, contactNumber, about } =
    user?.additionalDetails || {};

  const [img, setImg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [confirmationModal, setConfirmationModal] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleProfileImageSubmit = (e) => {
    e.preventDefault();
    dispatch(setProfileImage(img));
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    setConfirmationModal({
      title: "Confirm Account Deletion",
      message:
        "Are you sure you want to delete your account? This action cannot be undone.",
      onConfirm: () => {
        dispatch(deleteProfile(navigate));
        setConfirmationModal(null);
      },
      onCancel: () => {
        setConfirmationModal(null);
      },
    });
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    dispatch(resetProfilePassword(formData, navigate));
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        dispatch(setLoading(true));
        const res = await apiconnector(
          "GET",
          `${BASE_URL}/profile/getUserDetails`,
          null,
          { Authorization: `Bearer ${token}` }
        );
        if (!res.data.success) {
          throw new Error("getUserDetails api error");
        }
        // console.log("response from settings", res);
        setImage(res?.data?.userDetails?.additonalDetails?.image || null);
      } catch (error) {
        console.log("getUserDetails api error", error);
        toast.error(
          error.response?.data?.message ||
            "Something went wrong in getUserDetails"
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (token) {
      getUserDetails();
    }
  }, [token, dispatch]); 

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 text-white space-y-8">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-center">Account Settings</h1>

      {/* Profile Image Upload */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-900 p-4 rounded-md shadow">
        <img
          src={
            image
              ? image
              : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${firstName}+${lastName}`
          }
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-yellow-500"
        />
        <form
          onSubmit={handleProfileImageSubmit}
          className="flex flex-col gap-2 w-full sm:w-auto"
        >
          <label className="text-sm block mb-2 text-center sm:text-left">
            Select profile picture
          </label>

          <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-center">
            <label
              htmlFor="image"
              className={`bg-gray-800 ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-yellow-600"
              } text-white px-3 py-2 text-sm rounded cursor-pointer`}
            >
              Select
              <input
                type="file"
                id="image"
                name="image"
                className="hidden"
                onChange={(e) => setImg(e.target.files[0])}
                disabled={loading}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-sm px-3 py-2 rounded text-white flex items-center justify-center min-w-[80px]"
            >
              {loading ? (
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Personal Details Form */}
      <div className="bg-gray-900 p-6 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
        <form
          onSubmit={handleSubmit((data) => {
            dispatch(updateProfile(data, navigate));
            reset();
          })}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              id="firstname"
              defaultValue={firstName}
              register={register("firstName", { required: true })}
            />
            <InputField
              label="Last Name"
              id="lastname"
              defaultValue={lastName}
              register={register("lastName", { required: true })}
            />
            <InputField
              label="DOB"
              id="dob"
              type="date"
              defaultValue={dateOfBirth}
              register={register("dateOfBirth", {
                required: true,
                validate: (value) => {
                  const dob = new Date(value);
                  const today = new Date();
                  const age = today.getFullYear() - dob.getFullYear();
                  const monthDiff = today.getMonth() - dob.getMonth();
                  const dayDiff = today.getDate() - dob.getDate();

                  const exactAge =
                    monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
                      ? age - 1
                      : age;

                  return (
                    (exactAge >= 16 && exactAge <= 90) ||
                    "Age must be between 16 and 90 years"
                  );
                },
              })}
              min="1935-01-01"
              max="2009-12-31"
            />
            <div>
              <label htmlFor="gender" className="text-sm">
                Gender
              </label>
              <select
                id="gender"
                defaultValue={gender || ""}
                {...register("gender", { required: true })}
                className="bg-gray-700 text-white p-2 rounded-md outline-none w-full mt-1"
              >
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            <InputField
              label="Contact Number"
              id="number"
              type="number"
              defaultValue={contactNumber}
              register={register("contactNumber", { required: true })}
            />
            <InputField
              label="About"
              id="about"
              defaultValue={about}
              register={register("about", { required: true })}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Password Reset */}
      <div className="bg-gray-900 p-6 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordReset}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordInput
              label="Current Password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              showPassword={showPassword}
            />
            <PasswordInput
              label="New Password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              showPassword={showPassword}
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="mr-3 text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Password
            </button>
          </div>
        </form>
      </div>

      {/* Account Deletion */}
      <div className="bg-gray-900 p-6 rounded-md shadow mb-10">
        <h2 className="text-lg font-semibold">Delete Account</h2>
        <p className="inline-block bg-rose-100 text-rose-600 text-sm px-4 py-1 rounded-full my-2">
          ⚠️ Proceed with caution
        </p>
        <p className="text-sm mb-4">
          This action is irreversible. Please ensure you have a backup of your
          data.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="text-rose-500 text-sm underline"
        >
          Continue with deletion
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-white">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {confirmationModal.title}
            </h2>
            <p className="mb-4">{confirmationModal.message}</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={confirmationModal.onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmationModal.onConfirm}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, id, type = "text", defaultValue, register }) => (
  <div>
    <label htmlFor={id} className="text-sm">
      {label}
    </label>
    <input
      id={id}
      type={type}
      defaultValue={defaultValue}
      {...register}
      className="bg-gray-700 text-white p-2 rounded-md outline-none w-full mt-1"
    />
  </div>
);

const PasswordInput = ({ label, value, onChange, showPassword }) => (
  <div>
    <label className="text-sm">{label}</label>
    <input
      type={showPassword ? "text" : "password"}
      className="bg-gray-700 text-white p-2 rounded-md outline-none w-full mt-1"
      placeholder="********"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default Settings;
