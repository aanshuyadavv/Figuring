import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* COPYRIGHT */}
          <span className="text-sm text-gray-500 dark:text-gray-300 text-center sm:text-left">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://www.linkedin.com/in/anshu-yadav-contact/"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Anshu Yadav
            </a>
            . All rights reserved.
          </span>

          {/* SOCIAL ICONS */}
          <div className="flex space-x-6 text-xl">
            <a
              href="https://github.com/aanshuyadavv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black dark:hover:text-white transition duration-200"
              title="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/anshu-yadav-contact/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition duration-200"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
