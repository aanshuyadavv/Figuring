import React from "react";

const HighlightText = ({ text }) => {
  return (
    <span className="text-blue-400 break-words whitespace-pre-line">
      {text}
    </span>
  );
};

export default HighlightText;
