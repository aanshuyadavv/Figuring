import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Cards = ({ courses = [] }) => {
  return (
    <motion.div
      className="text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={40}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        loop
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
        {courses.map((course) => (
          <SwiperSlide key={course._id}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-[#1c1c24] p-4 rounded-2xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 h-full flex flex-col"
            >
              <Link to={`/course/${course._id}`}>
                <img
                  src={course?.thumbnail}
                  alt={course?.courseName}
                  className="w-full h-44 object-cover rounded-xl mb-4"
                  loading="lazy"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-purple-200 line-clamp-2">
                      {course?.courseName || "Untitled Course"}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-2">
                      {course?.courseDescription?.slice(0, 100) ||
                        "No description available"}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={course?.instructor?.image || "/default-avatar.png"}
                        alt="Instructor"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-purple-100 font-medium">
                        {course?.instructor?.firstName || "Instructor"}{" "}
                        {course?.instructor?.lastName || ""}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-lg font-semibold text-yellow-300">
                      ₹{course?.price || "Free"}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};

export default Cards;
