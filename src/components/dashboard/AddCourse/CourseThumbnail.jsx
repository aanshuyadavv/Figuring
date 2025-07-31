import React, { useState } from "react";

const CourseThumbnail = ({ register, errors }) => {
  const [preview, setPreview] = useState(null);

  const cancelHandler = () => {
    setPreview(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1 text-white">
        Course Thumbnail
      </label>

      <input
        type="file"
        accept="image/*"
        {...register("thumbnail", {
          required: "Thumbnail is required",
          onChange: (e) => {
            const fileObj = e.target.files && e.target.files[0];
            if (!fileObj) return;
            setPreview(URL.createObjectURL(fileObj));
          },
        })}
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4
                   file:rounded file:border-0 file:text-sm file:font-semibold
                   file:bg-yellow-500 file:text-black hover:file:bg-yellow-400
                   cursor-pointer bg-gray-800 border border-gray-700 rounded focus:outline-none"
      />

      {errors?.thumbnail && (
        <p className="text-red-500 text-sm mt-1">
          {errors.thumbnail.message}
        </p>
      )}

      {preview && (
        <div className="mt-4 relative max-w-xs">
          <img
            src={preview}
            alt="Preview"
            className="rounded-lg w-full h-auto object-cover border border-gray-700"
          />
          <button
            type="button"
            onClick={cancelHandler}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs hover:bg-red-500 transition"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseThumbnail;
