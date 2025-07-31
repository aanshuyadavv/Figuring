import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Oops!</h1>
        <p className="text-xl">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

export default ErrorPage;
