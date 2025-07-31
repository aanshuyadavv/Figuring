import React, { useState } from "react";
import SidebarData from "../../data/SidebarData";
import { Link, matchPath, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../services/authApi";

const SideBar = () => {
  const { user } = useSelector((state) => state.profile);
  const { accountType } = user || { accountType: "both" };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmationModal, setConfirmationModal] = useState(null);

  function matchRoute(path) {
    return matchPath({ path }, location.pathname);
  }

  function clickHandler(e) {
    e.preventDefault();
    setConfirmationModal({
      title: "Confirm Logout",
      message: "Are you sure you want to logout?",
      onConfirm: () => {
        dispatch(logout(navigate));
        navigate("/");
      },
      onCancel: () => setConfirmationModal(null),
    });
  }

  return (
    <div className="relative flex h-full flex-col w-full max-w-[15rem] p-4 rounded-xl bg-gray-800 text-white shadow-xl shadow-blue-gray-900/5 animate-slide-in">
      {/* Sidebar Title */}
      <div className="mb-4 p-4 border-b border-gray-600">
        <h5 className="text-xl font-semibold tracking-wide text-white">
          Dashboard
        </h5>
      </div>

      {/* Sidebar Links */}
      <nav className="flex flex-col gap-1 min-w-[200px] font-sans text-base mt-4">
        {SidebarData.map(
          (item, index) =>
            (item.accType === accountType || item.accType === "both") && (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                  matchRoute(item.path)
                    ? "bg-yellow-500 text-black shadow-md"
                    : "bg-gray-800 text-white hover:bg-gray-700 hover:scale-[1.02]"
                }`}
              >
                <item.icon className="text-xl" />
                <span>{item.title}</span>
              </Link>
            )
        )}

        {/* Logout */}
        <button
          onClick={clickHandler}
          className="text-left mt-3 ml-2 flex items-center gap-2 p-2 rounded-lg bg-gray-800 text-white hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          Logout
        </button>
      </nav>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
          <div className="bg-gray-800 p-4 rounded-lg shadow-2xl w-[90%] max-w-sm animate-slide-in">
            <h2 className="text-xl font-semibold mb-3">
              {confirmationModal.title}
            </h2>
            <p className="mb-5 text-gray-300">{confirmationModal.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={confirmationModal.onCancel}
                className="px-3 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmationModal.onConfirm}
                className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
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

export default SideBar;
