import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const RequirementField = ({ register, errors, setValue }) => {
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementsList] = useState([]);

  useEffect(() => {
    setValue("requirements", requirementList);
  }, [requirementList, setValue]);

  function addHandler() {
    const trimmed = requirement.trim();
    if (!trimmed) {
      toast.error("Requirement cannot be empty");
      return;
    }
    if (requirementList.includes(trimmed)) {
      toast.error("This requirement is already added");
      return;
    }
    setRequirementsList((prev) => [...prev, trimmed]);
    setRequirement("");
  }

  function clearHandler(index) {
    setRequirementsList((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="text-white space-y-4">
      <label htmlFor="requirement" className="block text-sm font-medium mb-1">
        Requirements
      </label>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          id="requirement"
          type="text"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Add a requirement"
          aria-label="Requirement input"
          className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
        />
        <button
          type="button"
          onClick={addHandler}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md"
        >
          Add
        </button>
      </div>

      {requirementList.length > 0 && (
        <div className="space-y-2">
          {requirementList.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-700 px-4 py-2 rounded-md"
            >
              <span className="break-words max-w-[80%]">{item}</span>
              <button
                type="button"
                onClick={() => clearHandler(index)}
                className="text-red-400 hover:text-red-600 font-semibold"
              >
                Clear
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden input to store the list */}
      <input type="hidden" {...register("requirements", {
        validate: (value) => value.length > 0 || "At least one requirement is required"
      })} />

      {errors?.requirements && (
        <p className="text-red-500 text-sm">{errors.requirements.message}</p>
      )}
    </div>
  );
};

export default RequirementField;
