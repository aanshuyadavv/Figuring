import React from "react";
import { motion } from "framer-motion";

const bounceTransition = {
  y: {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  },
};

const AnimatedLoader = ({ message = "Fetching your enrolled courses..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      {/* Bouncing Dots */}
      <div className="flex space-x-3">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-4 h-4 rounded-full bg-yellow-400"
            animate={{ y: ["0%", "-60%"] }}
            transition={{ ...bounceTransition, delay: i * 0.1 }}
          />
        ))}
      </div>

      {/* Loading Message */}
      <p className="text-yellow-400 text-lg font-semibold tracking-wide text-center px-4">
        {message}
      </p>
    </div>
  );
};

export default AnimatedLoader;
