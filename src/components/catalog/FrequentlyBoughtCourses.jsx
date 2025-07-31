import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FrequentlyBoughtCourses = () => {
  const { otherCourses } = useSelector((state) => state.steps);

  // Handle no courses
  if (!otherCourses || otherCourses.length === 0) {
    return (
      <p className="text-center text-gray-400 italic mt-6">
        No courses to show yet.
      </p>
    );
  }

  return (
    <motion.div
      className="text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={40}
        slidesPerView={3}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="mySwiper"
      >
        {otherCourses.map((category, idx) =>
          category?.courses?.map((course, index) => (
            <SwiperSlide key={`${idx}-${index}`}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-[#1c1c24] p-4 rounded-2xl shadow-lg hover:shadow-yellow-300/50 transition-all duration-300 h-full flex flex-col"
              >
                <Link to={`/course/${course._id}`}>
                  <img
                    src={course?.thumbnail || "/default-thumbnail.png"}
                    alt={course?.courseName || "Course Thumbnail"}
                    onError={(e) =>
                      (e.target.src = "/default-thumbnail.png")
                    }
                    className="w-full h-44 object-cover rounded-xl mb-4"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-yellow-200 line-clamp-2">
                        {course?.courseName || "Untitled Course"}
                      </h3>

                      <p className="text-sm text-gray-400 line-clamp-2">
                        {course?.courseDescription?.slice(0, 100) ||
                          "No description available."}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <img
                          src={
                            course?.instructor?.image ||
                            "/default-avatar.png"
                          }
                          alt="Instructor"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm text-yellow-100 font-medium">
                          {course?.instructor?.firstName || "Instructor"}{" "}
                          {course?.instructor?.lastName || ""}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-lg font-semibold text-green-400">
                        ₹{course?.price ?? "0"}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </motion.div>
  );
};

export default FrequentlyBoughtCourses;
