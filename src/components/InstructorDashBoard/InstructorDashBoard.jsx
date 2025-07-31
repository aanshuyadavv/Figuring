import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiconnector } from "../../services/apiConnector";
import toast from "react-hot-toast";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BASE_URL = process.env.REACT_APP_BASE_URL;

const InstructorDashBoard = () => {
  const { token } = useSelector((state) => state.auth);
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchInstructorDetails() {
    setLoading(true);
    try {
      const response = await apiconnector(
        "GET",
        `${BASE_URL}/fetchInstructorDetails`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error("fetchInstructorDetails api error");
      }
      setInstructor(response?.data?.instructorDetails);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong in fetchInstructorDetails"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchInstructorDetails();
    }
  }, [token]);

  const totalCourses = instructor?.courses?.length || 0;

  const totalStudents = instructor?.courses?.reduce((acc, course) => {
    return acc + (course.studentsEnrolled?.length || 0);
  }, 0);

  const totalRevenue = instructor?.courses?.reduce((acc, course) => {
    return acc + course.price * (course.studentsEnrolled?.length || 0);
  }, 0);

  return (
    <div className="text-white px-6 py-4 space-y-8 w-full max-w-7xl mx-auto">
      <h1 className="text-xl font-bold text-start">Instructor Dashboard</h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-300">
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce delay-300"></div>
          </div>
          <p className="text-sm">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats and Pie chart */}
          <div className="flex justify-evenly items-start gap-6 flex-wrap">
            {instructor && (
              <div className="bg-gray-900 rounded-2xl p-4 shadow flex-1 min-w-[280px] max-w-md w-full">
                {(() => {
                  const validCourses = instructor.courses.filter(
                    (course) =>
                      course.courseName &&
                      Array.isArray(course.studentsEnrolled)
                  );

                  const labels = validCourses.map(
                    (course) => course.courseName
                  );
                  const dataValues = validCourses.map(
                    (course) => course.studentsEnrolled.length
                  );

                  return (
                    <div className="h-[300px]">
                      <Pie
                        data={{
                          labels: labels,
                          datasets: [
                            {
                              label: "Students Enrolled",
                              data: dataValues,
                              backgroundColor: [
                                "#f87171",
                                "#60a5fa",
                                "#34d399",
                                "#fbbf24",
                                "#a78bfa",
                                "#fb923c",
                                "#38bdf8",
                                "#818cf8",
                                "#f472b6",
                                "#4ade80",
                              ],
                              borderColor: "#111827",
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "bottom",
                              labels: {
                                color: "#fff",
                                boxWidth: 12,
                                font: { size: 12 },
                              },
                            },
                            title: {
                              display: true,
                              text: "Enrollment per Course",
                              color: "#fff",
                              font: { size: 16 },
                            },
                          },
                        }}
                      />
                    </div>
                  );
                })()}
              </div>
            )}

            {instructor && (
              <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-sm md:max-w-md">
                <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow">
                  <p className="text-lg">Total Courses</p>
                  <p className="text-2xl font-semibold">{totalCourses}</p>
                </div>

                <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow">
                  <p className="text-lg">Total Students Enrolled</p>
                  <p className="text-2xl font-semibold">{totalStudents}</p>
                </div>

                <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow">
                  <p className="text-lg">Total Revenue Generated</p>
                  <p className="text-2xl font-semibold">₹ {totalRevenue}</p>
                </div>
              </div>
            )}
          </div>

          {/* Your Courses Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructor?.courses?.length > 0 ? (
                instructor.courses.map((course, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow p-3"
                  >
                    <img
                      src={course.thumbnail}
                      alt={`Course ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <h3 className="mt-2 text-lg font-semibold">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-400">₹{course.price}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No courses found.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InstructorDashBoard;
