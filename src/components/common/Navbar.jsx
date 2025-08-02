import React, { useState, useEffect } from "react";
import { Navlinks } from "../../data/Nav-links";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileDropDown from "../homepage/ProfileDropDown";
import { FcExpand } from "react-icons/fc";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { apiconnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import FiguringHero from "../common/FiguringHero";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  // console.log("token from nav", token);
  const { user } = useSelector((state) => state.profile);
  // console.log("user from nav", user);
  const location = useLocation();
  const [subLinks, setSubLinks] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);

  const fetchSubLinks = async () => {
    try {
      const result = await apiconnector(
        "GET",
        categories.CATEGORIES_URL,
        null,
        { Authorization: `Bearer ${token}` }
      );
      if (result?.data?.data) {
        setSubLinks(result.data.data);
      }
    } catch (error) {
      console.error("Couldn't fetch categories:", error);
    }
  };

  useEffect(() => {
    if (token) fetchSubLinks();
  }, [token]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileCatalogOpen(false);
  }, [location.pathname]);

  return (
    <nav className="w-full bg-black shadow-sm z-50 relative">
      <div className="max-w-screen-xl mx-auto h-16 px-4 flex items-center justify-between">
        <FiguringHero />
        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 text-white font-medium relative">
          {Navlinks.map((link, index) =>
            link.title === "Catalog" && token && user ? (
              <li
                key={index}
                className="relative group cursor-pointer text-white"
              >
                <div className="flex items-center gap-1">
                  {link.title}
                  <FcExpand />
                </div>
                <div className="absolute top-10 left-0 bg-white text-black w-52 shadow-md rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-20">
                  {subLinks.length > 0 ? (
                    subLinks.map((sub, i) => (
                      <Link
                        key={i}
                        to={`/catalog/${sub.name.split(" ").join("-")}-${
                          sub._id
                        }`}
                        className="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600 transition"
                      >
                        {sub.name}
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-400">
                      No categories
                    </div>
                  )}
                </div>
              </li>
            ) : (
              <li key={index}>
                <Link
                  to={link.path}
                  className={`${
                    location.pathname === link.path
                      ? "text-yellow-400"
                      : "text-white"
                  } hover:text-yellow-300 transition`}
                >
                  {link.title}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {token && user ? (
            <ProfileDropDown />
          ) : (
            <>
              <Link to="/login">
                <button className="text-white border border-gray-500 px-4 py-1 rounded-md hover:bg-gray-800 transition">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="text-white border border-gray-500 px-4 py-1 rounded-md hover:bg-gray-800 transition">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
        {/* Hamburger Menu */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMobileMenuOpen(true)}
        >
          <HiOutlineMenuAlt3 />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 space-y-4">
          {Navlinks.map((link, index) =>
            link.title === "Catalog" ? (
              <div key={index}>
                <div
                  className="flex items-center justify-between cursor-pointer font-medium text-gray-300"
                  onClick={() => setMobileCatalogOpen((prev) => !prev)}
                >
                  Catalog
                  <FcExpand
                    className={`${
                      mobileCatalogOpen && "rotate-180"
                    } transition`}
                  />
                </div>
                {mobileCatalogOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {subLinks.length > 0 ? (
                      subLinks.map((sub, i) => (
                        <Link
                          key={i}
                          to={`/catalog/${sub.name.split(" ").join("-")}-${
                            sub._id
                          }`}
                          className="block text-sm text-gray-300 hover:text-blue-600"
                        >
                          {sub.name}
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-gray-300">No categories</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={index}
                to={link.path}
                className={`block font-medium text-gray-300 hover:text-blue-600`}
              >
                {link.title}
              </Link>
            )
          )}

          {/* Mobile Auth Buttons */}
          <div className="pt-4 border-t">
            {token && user ? (
              (console.log(token), (<ProfileDropDown />))
            ) : (
              <>
                <Link to="/login">
                  <button className="w-full text-left py-2 text-gray-300 hover:text-black">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="w-full text-left py-2 text-gray-300 hover:text-black">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
