import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Footer from "./components/homepage/Footer";
import Navbar from "./components/common/Navbar";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useState } from "react";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import AboutPage from "./pages/AboutPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import MyProfile from "./components/dashboard/MyProfile";
import Settings from "./components/dashboard/Settings";
import ErrorPage from "./pages/ErrorPage";
import EnrolledCourses from "./components/dashboard/EnrolledCourses";
import Cart from "./components/dashboard/cart/index";
import { useSelector } from "react-redux";
import PrivateRoute from "./components/auth/PrivateRoute";
import AddCourse from "./components/dashboard/AddCourse/AddCourse";
import MyCourses from "./components/dashboard/MyCourses/MyCourses";
import EditCourse from "./components/dashboard/AddCourse/publishCourseForm/EditCourse";
import CatalogPage from "./pages/CatalogPage";
import CourseDetails from "./components/catalog/CourseDetails";
import InstructorDashBoard from "./components/InstructorDashBoard/InstructorDashBoard";
import Contact from "./pages/Contact";
const App = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  return (
    <div className="min-h-screen w-[screen] ">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<UpdatePassword />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/catalog/:slug" element={<CatalogPage />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute token={token}>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="my-settings" element={<Settings />} />

          {user?.accountType === "student" && (
            <>
              <Route path="enrolled-courses" element={<EnrolledCourses />} />
              <Route path="cart" element={<Cart />} />
            </>
          )}
          {user?.accountType === "instructor" && (
            <>
              <Route path="/dashboard/add-course" element={<AddCourse />} />
              <Route path="/dashboard/my-courses" element={<MyCourses />} />
              <Route path="/dashboard/instructor" element={<InstructorDashBoard />} />
              <Route
                path="/dashboard/course/edit/:id"
                element={<EditCourse />}
              />
            </>
          )}
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
