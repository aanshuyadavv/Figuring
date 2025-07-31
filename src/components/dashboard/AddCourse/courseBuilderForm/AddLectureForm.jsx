import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSubSection } from "../../../../services/subsectionApi";
import toast from "react-hot-toast";

const AddLectureForm = ({ index }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { section } = useSelector((state) => state.course) || {};
  const subsectionMap = useSelector((state) => state.course.subsection) || {};

  const selectedSection = section?.[index] || {};
  const sectionId = selectedSection?._id || "";

  const [form, setForm] = useState({
    video: "",
    title: "",
    description: "",
  });
  const [videoPreview, setVideoPreview] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.video) {
      toast.error("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("sectionId", sectionId);
    formData.append("videoFile", form.video);

    try {
      await dispatch(createSubSection(formData, token));
      toast.success("Lecture added successfully!");

      // Reset form after submission
      setForm({ video: "", title: "", description: "" });
      setVideoPreview(null);
    } catch (err) {
      toast.error("Error adding lecture.");
      console.error(err);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setForm((prev) => ({ ...prev, video: file }));
      setVideoPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, video: "" }));
      setVideoPreview(null);
      toast.error("Please upload a valid video file.");
    }
  };

  return (
    <div className="text-white mx-auto p-4 bg-gray-900 rounded-lg shadow-md max-w-md">
      <h2 className="text-lg font-semibold mb-4">Add New Lecture</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Upload Video */}
        <div>
          <label className="block text-xs font-medium mb-1">
            Upload Lecture Video
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full text-xs text-gray-400 file:bg-gray-800 file:border-none file:px-3 file:py-1 file:rounded file:text-white file:cursor-pointer"
          />
        </div>

        {/* Video Preview */}
        {videoPreview && (
          <div className="w-full max-w-xs mx-auto mt-4">
            <video
              src={videoPreview}
              controls
              className="rounded border border-gray-700 w-full h-auto aspect-video object-cover"
            />
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-medium mb-1">
            Lecture Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
            placeholder="Enter lecture title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium mb-1">
            Lecture Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
            placeholder="Enter short description"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-2 w-full px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded hover:bg-yellow-400 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddLectureForm;
