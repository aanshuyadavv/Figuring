import React from "react";
import Template from "../components/auth/Template";
import signupImg from "../assets/signup.png";
import frame from "../assets/frame.png";
import { useSelector } from "react-redux";

function SignUpPage({ setIsLoggedIn }) {
  const { loading } = useSelector((state) => state.auth);

  return (
    <>
      {loading && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-md shadow-md border border-gray-300 text-sm font-medium z-50">
          Loading...
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center p-4">
        <Template
          title="Join the millions learning to code with StudyNotion for free"
          description1="Build skills for today, tomorrow, and beyond."
          description2="Education to future-proof your career."
          image={signupImg}
          formType="signup"
          setIsLoggedIn={setIsLoggedIn}
          frame={frame}
        />
      </div>
    </>
  );
}

export default SignUpPage;
