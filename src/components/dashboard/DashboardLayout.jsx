import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import { IoMdMenu } from "react-icons/io";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white relative">
      {/* Hamburger for small screens */}
      <button
        className="absolute top-4 left-4 text-3xl sm:hidden z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <IoMdMenu />
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed sm:static top-0 left-0 min-h-screen w-[240px] bg-gray-800 shadow-lg border-r border-gray-700 z-40 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
        `}
      >
        <SideBar />
      </div>

      {/* Overlay for closing sidebar on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-6 animate-fade-in">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
