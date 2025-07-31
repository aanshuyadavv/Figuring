import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import YellowBtn from "../components/homepage/YellowBtn";
import HighlightText from "../components/homepage/HighlightText";
import meet from "../assets/Images/meet.jpg";
import Card from "../components/homepage/Card";
import CodeBox from "../components/homepage/CodeBox";
import LeaderShip from "../components/homepage/LeaderShip";
import HomePageExplore from "../components/homepage/HomePageExplore";
import instructor from "../assets/Images/instructor.jpg";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="w-11/12 max-w-7xl mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <button className="p-3 px-5 rounded-2xl bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2 mx-auto">
            Become an Instructor <FaArrowRight />
          </button>

          <h1 className="text-4xl font-bold text-white">
            Empower your future with{" "}
            <span className="text-blue-400">
              <HighlightText text="coding skills" />
            </span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto">
            With our online courses, you can learn at your own pace from
            anywhere in the world and get access to a wealth of projects
            including hands-on projects, quizzes, and personalized feedback from
            instructors.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            <YellowBtn text="Learn More" path="/" />
            <NavLink to="/">
              <button className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded transition duration-300">
                Book a Demo
              </button>
            </NavLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-md sm:max-w-2xl aspect-video mx-auto mt-8"
        >
          <div className="absolute top-3 left-3 h-full w-full bg-white rounded z-0 shadow-lg" />
          <img
            src={meet}
            alt="Meet"
            className="h-full w-full object-cover rounded z-10 relative shadow-xl"
          />
        </motion.div>

        {/* Features Section */}
        <div className="flex flex-col gap-16 mt-20">
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <Card
              title1="Unlock your"
              title2="with our online course"
              description="Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
              blueTitle="coding potential"
              btnText="Try it yourself"
            />
            <div className="hidden lg:block">
              <CodeBox />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col-reverse lg:flex-row-reverse justify-between items-center gap-8">
            <Card
              title1="Start"
              blueTitle="coding in seconds"
              description="Go ahead. Give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
              btnText="Continue lesson"
            />
            <div className="hidden lg:block">
              <CodeBox />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <HomePageExplore />
        </div>
      </div>

      {/* Explore Section */}
      <div className="bg-gradient-to-r from-gray-800 to-black py-12 mt-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex gap-4 flex-wrap justify-center">
            <YellowBtn text="Explore Full Catalog" path="/" />
            <NavLink to="/">
              <button className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded transition duration-300">
                Book a Demo
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white py-20">
        <div className="w-11/12 max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="max-w-md">
            <p className="text-xl text-gray-800 font-semibold">
              Get the skills you need for a{" "}
              <HighlightText text="job that is in demand" />
            </p>
          </div>

          <div className="lg:w-1/2 text-gray-600">
            <p>
              The modern StudyNotion dictates its own terms. Today, to be a
              competitive specialist requires more than professional skills.
            </p>
            <div className="mt-4">
              <YellowBtn text="Learn More" path="/" />
            </div>
          </div>
        </div>

        <LeaderShip meet={meet} />
      </div>

      {/* Instructor Section */}
      <div className="bg-[#101218] py-24 text-white">
        <div className="w-11/12 max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 shadow-xl"
          >
            <img
              src={instructor}
              alt="Instructor"
              className="rounded object-cover w-full h-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h2 className="text-3xl font-bold">
              Become <HighlightText text="an Instructor" />
            </h2>
            <p className="text-gray-400">
              Instructors from around the world teach millions of students on
              StudyNotion. We provide the tools and skills to teach what you
              love.
            </p>
            <YellowBtn text="Start Learning Today" />
          </motion.div>
        </div>

        <p className="text-center mt-12 text-lg font-semibold">
          Reviews From Others
        </p>
      </div>
    </>
  );
};

export default HomePage;
