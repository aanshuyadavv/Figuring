import React, { useState } from "react";

const LectThumbnail = ({ register, errors }) => {
  const [file, setFile] = useState(null);

  function cancelHandler() {
    setFile(null);
  }

  return (
    <div className="text-white space-y-3">
      <h1 className="text-base sm:text-lg font-semibold">Course Thumbnail</h1>

      {/* File Upload */}
      <input
        type="file"
        className="w-full text-xs text-gray-300 file:bg-gray-800 file:border-none file:px-4 file:py-2 file:rounded file:text-white file:cursor-pointer"
        {...register("thumbnail", {
          required: "Thumbnail is required",
          onChange: (e) => {
            const fileObj = e.target.files?.[0];
            if (!fileObj) return;
            setFile(URL.createObjectURL(fileObj));
          },
        })}
      />

      {/* Error Message */}
      {errors?.thumbnail && (
        <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>
      )}

      {/* Preview */}
      {file && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
          <img
            src={file}
            alt="Uploaded preview"
            className="w-24 h-24 rounded-md object-cover border border-gray-600"
          />
          <button
            type="button"
            onClick={cancelHandler}
            className="text-xs bg-gray-600 px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default LectThumbnail;
