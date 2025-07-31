import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditBtn from "../../components/dashboard/EditBtn";
import toast from "react-hot-toast";
import { apiconnector } from "../../services/apiConnector";
import { setLoading } from "../../slices/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/profileeSlice";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const [imgProfile, setImgProfile] = useState(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { firstName, lastName, email, accountType } = user || {};
  const { gender, dateOfBirth, contactNumber, about } =
    user?.additonalDetails || {};

  const dob = new Date(dateOfBirth || "");
  const day = dob.getDate();
  const monthName = dob.toLocaleString("default", { month: "long" });
  const year = dob.getFullYear();

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
        // console.log("response from my profile", res);
        setImgProfile(res?.data?.userDetails?.additonalDetails?.image || null);
        dispatch(setUser(res?.data?.userDetails));
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
    <div className="flex flex-col items-center px-4 py-6 sm:px-6 lg:px-8 text-white w-full max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8 text-center">Profile</h1>

      {/* Profile Card */}
      <div className="w-full space-y-6">
        {/* Top Section */}
        <div className="bg-gray-900 p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 hover:scale-[1.01] transition-transform">
          <div className="flex items-center gap-4">
            <img
              src={
                imgProfile
                  ? imgProfile
                  : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${firstName}+${lastName}`
              }
              alt="Profile"
              className="w-20 h-20 sm:w-16 sm:h-16 rounded-full border-2 border-yellow-500 object-cover"
            />
            <div>
              <h2 className="text-lg font-bold capitalize">
                {firstName || "Add first name"}
              </h2>
              <p className="text-sm text-gray-400">
                {accountType || "Add account type"}
              </p>
            </div>
          </div>
          <EditBtn />
        </div>

        {/* About Section */}
        <div className="bg-gray-900 p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:scale-[1.01] transition-transform">
          <div>
            <h3 className="text-lg font-semibold">About Me</h3>
            <p className="text-sm text-gray-400 mt-2">
              {about || "Write about yourself"}
            </p>
          </div>
          <EditBtn />
        </div>

        {/* Personal Details */}
        <div className="bg-gray-900 p-6 rounded-lg shadow hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Personal Details</h3>
            <EditBtn />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Detail label="First Name" value={firstName} />
            <Detail label="Last Name" value={lastName} />
            <Detail label="Email" value={email} />
            <Detail label="Contact Number" value={contactNumber} />
            <Detail label="Gender" value={gender} />
            <Detail
              label="Date Of Birth"
              value={
                dateOfBirth
                  ? `${day} ${monthName} ${year}`
                  : "Add date of birth"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-white">{value || `Add ${label.toLowerCase()}`}</p>
  </div>
);

export default MyProfile;
