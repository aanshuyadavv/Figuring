// FiguringHero.jsx
import React from "react";
import { motion } from "framer-motion";


const FiguringHero = () => {
  return (
    <div className="flex items-center justify-center bg-black">
      <motion.h1
        className="text-white text-2xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        Figuring
      </motion.h1>
    </div>
  );
};

export default FiguringHero;
