import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../services/authApi";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { apiconnector } from "../../services/apiConnector";
import { setUser, setLoading } from "../../slices/profileeSlice";
import toast from "react-hot-toast";
import { useEffect } from "react";
const BASE_URL = process.env.REACT_APP_BASE_URL;
const ProfileDropDown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropMenuOpen, setDropMenuOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [imgProfile, setImgProfile] = useState(null);
  const { user, image: profileImageFromState } = useSelector(
    (state) => state.profile
  );
  const image = profileImageFromState || user?.image;
  const { firstName, lastName } = user || {};

  const handleLogout = () => {
    dispatch(logout(navigate));
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
    <div className="relative">
      <img
        alt="Profile"
        loading="lazy"
        src={
          imgProfile
            ? imgProfile
            : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${firstName}+${lastName}`
        }
        onClick={() => setDropMenuOpen((prev) => !prev)}
        className="h-10 w-10 cursor-pointer rounded-full object-cover border-2 border-gray-300 shadow-sm hover:ring-2 ring-yellow-400 transition duration-150 ease-in-out"
      />

      {dropMenuOpen && (
        <ul
          role="menu"
          className="absolute right-0 top-14 z-20 min-w-[140px] rounded-md border bg-white shadow-lg py-2"
        >
          <li role="menuitem">
            <Link
              to="/dashboard/my-profile"
              className="flex items-center text-sm text-slate-800 px-4 py-2 hover:bg-gray-100 transition"
              onClick={() => setDropMenuOpen(false)}
            >
              <FaUser className="mr-2" />
              My Profile
            </Link>
          </li>
          <hr className="my-2 border-slate-200" role="menuitem" />
          <li role="menuitem">
            <button
              onClick={handleLogout}
              className="w-full flex items-center text-sm text-slate-800 px-4 py-2 hover:bg-gray-100 transition"
            >
              <FaSignOutAlt className="mr-2" />
              Sign Out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropDown;
