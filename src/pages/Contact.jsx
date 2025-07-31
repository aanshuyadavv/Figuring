import React from "react";
import Spline from "@splinetool/react-spline";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import anshu from "../assets/Images/anshu.jpg";

const Contact = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* 3D Background */}
      <Spline scene="https://prod.spline.design/STpWiaeQKxSXLyon/scene.splinecode" />

      {/* Overlay Content */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col lg:flex-row items-center justify-center gap-y-8 lg:justify-between px-4 sm:px-10 lg:px-20 text-white pointer-events-none">
        {/* Right Section: Profile */}
        <motion.div
          className="relative  w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full pointer-events-auto group"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Glow Ring */}
          <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 animate-pulse z-0" />

          {/* Floating Image */}
          <motion.img
            src={anshu}
            alt="Anshu Yadav"
            className="relative w-full h-full rounded-full border-4 border-gray-800 object-cover shadow-xl transition-transform duration-300 group-hover:scale-105"
            animate={{ y: [0, -8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            }}
          />
        </motion.div>
        {/* Left Section */}
        <div className="w-full lg:w-[35%] max-w-2xl pointer-events-auto text-center lg:text-left">
          {/* Heading */}
          <motion.h1
            className="text-2xl sm:text-3xl md:text-3xl font-bold mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Let’s Connect
          </motion.h1>

          {/* Bio */}
          <motion.p
            className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 leading-relaxed mx-auto lg:mx-0 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            I'm <strong>Anshu Yadav</strong> — I build things, explore places,
            read poetry, and love deep talks with my favorite people.
          </motion.p>

          {/* Social Icons */}
          <motion.div
            className="flex justify-center lg:justify-start space-x-6 text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4 }}
          >
            <a
              href="https://github.com/aanshuyadavv"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/anshu-yadav-contact/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:anshuyadav.code@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-400 transition"
            >
              <FaEnvelope />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
