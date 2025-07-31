import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSubSection } from "../../../../services/subsectionApi";
import toast from "react-hot-toast";

const EditLectureForm = ({ index, subIndex, sectionId, subSectionId }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { subsection } = useSelector((state) => state.course);

  const currentSubsections = subsection?.[sectionId] || [];
  const lecture = currentSubsections?.[subIndex] || {};

  const [form, setForm] = useState({
    title: lecture.title || "",
    description: lecture.description || "",
    video: null,
  });

  const [videoPreview, setVideoPreview] = useState(null);
  const [existingVideoUrl] = useState(lecture.videoUrl || "");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setForm((prev) => ({ ...prev, video: file }));
      setVideoPreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid video file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("sectionId", sectionId);
    formData.append("subSectionId", subSectionId);
    if (form.video) {
      formData.append("videoFile", form.video);
    }

    try {
      await dispatch(updateSubSection(formData, token));
      toast.success("Lecture updated successfully!");
    } catch (error) {
      toast.error("Failed to update lecture.");
      console.error(error);
    }
  };

  return (
    <div className="text-white mx-auto p-4 bg-gray-900 rounded-lg shadow-md max-w-md">
      <h2 className="text-lg font-semibold mb-4">Edit Lecture</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Upload Video */}
        <div>
          <label className="block text-xs font-medium mb-1">
            Upload New Video (optional)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleChange}
            className="w-full text-xs text-gray-400 file:bg-gray-700 file:border-none file:px-3 file:py-1 file:rounded file:text-white file:cursor-pointer"
          />
        </div>

        {/* Video Preview */}
        {videoPreview ? (
          <video
            controls
            src={videoPreview}
            className="w-full border border-gray-700 rounded"
          />
        ) : existingVideoUrl ? (
          <video
            controls
            src={existingVideoUrl}
            className="w-full border border-gray-700 rounded"
          />
        ) : null}

        {/* Title */}
        <div>
          <label className="block text-xs font-medium mb-1">
            Lecture Title
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium mb-1">
            Lecture Description
          </label>
          <textarea
            required
            rows={2}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-1 text-sm bg-gray-600 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1 text-sm bg-yellow-500 text-black font-medium rounded hover:bg-yellow-400 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLectureForm;
