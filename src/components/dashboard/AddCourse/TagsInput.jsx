import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const TagsInput = ({ register, errors, setValue }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const value = e.target.value.trim();
    if (!value) {
      toast.error("Tag cannot be empty");
      return;
    }
    if (tags.includes(value)) {
      toast.error("Tag already exists");
      return;
    }

    setTags((prev) => [...prev, value]);
    e.target.value = "";
  };

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2 text-white">
      <label htmlFor="tag-input" className="block text-sm font-medium mb-1">
        Tags
      </label>

      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-800 rounded-md border border-gray-600">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-2 text-black hover:text-red-600 font-bold"
              aria-label={`Remove tag ${tag}`}
            >
              &times;
            </button>
          </div>
        ))}
        <input
          id="tag-input"
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Press Enter to add tag"
          aria-label="Tag input"
          className="flex-grow min-w-[150px] px-3 py-1 bg-gray-900 text-white border-none focus:outline-none"
        />
      </div>

      <input
        type="hidden"
        value={tags.join(",")}
        {...register("tags", {
          validate: (val) => tags.length > 0 || "Please enter at least one tag",
        })}
      />

      {errors?.tags && (
        <p className="text-red-500 text-sm">{errors.tags.message}</p>
      )}
    </div>
  );
};

export default TagsInput;
