import React from "react";

const Stats = () => {
  const stats = [
    { count: "5k+", label: "Active Students" },
    { count: "10+", label: "Mentors" },
    { count: "200+", label: "Courses" },
    { count: "50+", label: "Awards" },
  ];

  return (
    <div className="bg-gray-900 text-white py-12">
      <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center transition-transform duration-300 transform hover:scale-105"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400">
              {stat.count}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mt-2">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
