import React from "react";
import YellowBtn from "../homepage/YellowBtn";
import HighlightText from "../homepage/HighlightText";

const LearningGrid = () => {
  const LearningGridArray = [
    {
      order: -1,
      heading: "World-Class Learning for",
      highlightText: "Anyone, anywhere",
      description:
        "StudyMotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
      btnText: "Learn More",
      btnLink: "/",
    },
    {
      order: 1,
      heading: "Curriculum based on industry need",
      description:
        "Save time and money! The Belajar curriculum is made to be easier to understand and inline with industry needs.",
    },
    {
      order: 2,
      heading: "Learn at your own pace",
      description:
        "No deadlines or pressure—learn whenever you want, wherever you are, with flexible schedules and bite-sized lessons.",
    },
    {
      order: 3,
      heading: "Mentorship by industry experts",
      description:
        "Get guidance from professionals working in top companies to help you learn the right way and avoid common mistakes.",
    },
    {
      order: 4,
      heading: "Real-world projects",
      description:
        "Practice with hands-on tasks and build projects that reflect real industry problems to boost your portfolio.",
    },
    {
      order: 5,
      heading: "Affordable and accessible",
      description:
        "Quality education shouldn’t break the bank—Belajar is designed to be budget-friendly and inclusive for everyone.",
    },
  ];

  return (
    <div className="w-[90%] max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 text-white">
      {LearningGridArray.map((card, index) => (
        <div
          key={index}
          className={`
            ${card.order === -1 ? "sm:col-span-2 bg-gradient-to-r from-gray-900 to-gray-800" : ""}
            ${card.order % 2 === 1 ? "bg-gray-800" : "bg-gray-900"}
            ${card.order === 3 ? "lg:col-start-2" : ""}
            rounded-xl p-6 shadow-md hover:scale-[1.02] hover:shadow-blue-500/30 transition-all duration-300 ease-in-out
          `}
        >
          {card.order === -1 ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold leading-snug">
                {card.heading} <br />
                <HighlightText text={card.highlightText} />
              </h2>
              <p className="text-sm sm:text-base text-gray-400">
                {card.description}
              </p>
              <div>
                <YellowBtn text={card.btnText} path={card.btnLink} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <h3 className="text-lg sm:text-xl font-semibold">
                {card.heading}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                {card.description}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LearningGrid;
