import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiconnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import toast from "react-hot-toast";
import Cards from "../components/catalog/Cards";
import TopCourses from "../components/catalog/TopCourses";
import FrequentlyBoughtCourses from "../components/catalog/FrequentlyBoughtCourses";
import {
  setCategoryCourses,
  setTopCourses,
  setOtherCourses,
} from "../slices/stepsSlice";
import { motion } from "framer-motion";
import { setLoading } from "../slices/courseSlice";

const CatalogPage = () => {
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [active, setActive] = useState("popular");

  const { token } = useSelector((state) => state.auth);
  // console.log("Token:", token);
  const { laoding } = useSelector((state) => state.course);
  const { categoryCourses, topCourses, otherCourses } = useSelector(
    (state) => state.steps
  );

  const { slug } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const parts = slug.split("-");
    const id = parts[parts.length - 1];
    const name = parts.slice(0, -1).join(" ");
    setCategoryId(id);
    setCategoryName(name);
  }, [slug]);

  const categoryDetails = async () => {
    try {
      dispatch(setLoading(true));
      const response = await apiconnector(
        "POST",
        categories.CATEGORIES_PAGE_DETAILS_API,
        { categoryId },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setCategoryDescription(response.data.data.selectedCategory.description);
      dispatch(setCategoryCourses(response.data.data.selectedCategory.courses));
      dispatch(setOtherCourses(response.data.data.otherCategoriesCourses));
      dispatch(setTopCourses(response.data.data.topSellingCourses));
    } catch (error) {
      toast.error(error.message);
      console.log("Error fetching category details:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (categoryId) {
      categoryDetails();
    }
  }, [categoryId]);

  const mostPopular = [...categoryCourses].sort(
    (a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length
  );

  const newestCourses = [...categoryCourses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      {laoding ? (
        <div className="flex items-center justify-center h-48">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce delay-150"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce delay-300"></div>
            <p className="text-white text-lg font-semibold ml-4 animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      ) : (
        <div className="text-white px-4 md:px-16 py-10 space-y-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <p className="text-sm text-gray-400">
              <span className="text-blue-500 hover:underline cursor-pointer">
                Home
              </span>{" "}
              / Catalog /{" "}
              <span className="text-yellow-300 font-medium">
                {categoryName}
              </span>
            </p>

            <h1 className="text-4xl font-extrabold text-white">
              {categoryName}
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl">
              {categoryDescription}
            </p>
          </motion.div>

          {/*Courses To Get Started */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white">
              Courses to get you started
            </h2>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActive("popular")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                  active === "popular"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                Most Popular
              </button>
              <button
                onClick={() => setActive("new")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                  active === "new"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                New
              </button>
            </div>

            <Cards
              courses={active === "popular" ? mostPopular : newestCourses}
            />
          </motion.div>

          {/* Top Courses */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white">Top Courses</h2>
            <TopCourses />
          </motion.div>

          {/* Other Courses */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white">Other Courses</h2>
            <FrequentlyBoughtCourses />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default CatalogPage;
