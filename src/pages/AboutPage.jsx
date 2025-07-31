import React from "react";
import HighlightText from "../components/homepage/HighlightText";
import abt1 from "../assets/Images/abt1.jpg";
import abt2 from "../assets/Images/abt2.jpg";
import abt3 from "../assets/Images/abt3.jpg";
import grp from "../assets/Images/grp.jpg";
import Stats from "../components/aboutpage/Stats";
import LearningGrid from "../components/aboutpage/LearningGrid";
import ContactForm from "../components/aboutpage/ContactForm";

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-20 mt-10 text-white">
      {/* Section 1 */}
      <div className="w-11/12 max-w-6xl mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center leading-snug">
          Driving Innovation in Online Education For a <br />
          <HighlightText text="Brighter Future" />
        </h1>
        <p className="text-gray-400 text-center max-w-2xl mx-auto text-sm">
          Driving innovation in online education paves the way for a brighter,
          more inclusive future. By leveraging technology and personalized
          tools, it breaks barriers, enhances engagement, and empowers learners
          everywhere to reach their full potential.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
          {[abt1, abt2, abt3].map((img, i) => (
            <div key={i} className="w-48 h-40 rounded-md overflow-hidden shadow-md">
              <img src={img} alt={`abt-${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Section 2 */}
      <div className="w-10/12 mx-auto">
        <h1 className="text-xl text-center font-medium leading-relaxed">
          We are passionate about revolutionizing the way we learn. Our
          informative platform <HighlightText text="combines technology," />
          <span className="text-red-500"> expertise </span> and communication to
          create an <span className="text-orange-400"> unparalleled educational experience.</span>
        </h1>
      </div>

      {/* Section 3 - Story, Vision, Mission */}
      <div className="w-11/12 max-w-6xl mx-auto grid gap-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-xl text-red-500 font-semibold">Our Founding Story</h2>
            <p className="text-sm text-gray-400">
              What began as a simple idea soon grew into a powerful mission—to
              make quality education accessible to all, anytime, anywhere. Born
              out of a shared passion for learning and innovation, our journey
              started with a vision to bridge gaps in traditional education
              through technology.
              <br />
              Faced with challenges, we turned them into opportunities, driven
              by the belief that knowledge should have no boundaries.
            </p>
          </div>
          <div className="md:w-1/2 h-64 rounded-md overflow-hidden shadow-lg">
            <img src={grp} alt="Group" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-xl text-orange-500 font-semibold">Our Vision</h2>
            <p className="text-sm text-gray-400">
              To create a world where learning is limitless, inclusive, and
              driven by innovation. We envision an education system that empowers
              every individual—regardless of background or location—to unlock
              their full potential.
            </p>
          </div>
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-xl text-blue-500 font-semibold">Our Mission</h2>
            <p className="text-sm text-gray-400">
              To revolutionize education by harnessing the power of technology,
              making learning accessible, engaging, and personalized for all.
              We are committed to breaking barriers, inspiring curiosity, and
              equipping learners with the confidence they need to thrive.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <Stats />

      {/* Section 5 */}
      <LearningGrid />

      {/* Section 6 */}
      <ContactForm />
    </div>
  );
};

export default AboutPage;