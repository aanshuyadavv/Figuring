import React from "react";
import { useForm } from "react-hook-form";
import CountryCode from "../../data/CountryCode.json";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = handleSubmit((data) => console.log(data));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 rounded-lg bg-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-white text-2xl sm:text-3xl font-semibold">
          Get In Touch
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-2">
          We would love to hear from you. Please fill out this form.
        </p>
      </div>

      <form onSubmit={submitHandler} className="flex flex-col gap-6">
        {/* First and Last Name */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full">
            <label htmlFor="firstname" className="text-white text-sm">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              {...register("firstname", { required: true })}
              className="bg-gray-700 text-white p-2 rounded-md w-full outline-none"
            />
            {errors.firstname && (
              <p className="text-red-400 text-sm mt-1">
                First name is required.
              </p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="lastname" className="text-white text-sm">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              {...register("lastname", { required: true })}
              className="bg-gray-700 text-white p-2 rounded-md w-full outline-none"
            />
            {errors.lastname && (
              <p className="text-red-400 text-sm mt-1">
                Last name is required.
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="text-white text-sm">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
            className="bg-gray-700 text-white p-2 rounded-md w-full outline-none"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">Email is required.</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label htmlFor="phoneNumber" className="text-white text-sm">
            Phone Number
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              name="countryCode"
              id="countryCode"
              className="bg-gray-700 text-white p-2 rounded-md w-full sm:w-40 outline-none"
            >
              {CountryCode.map((code, index) => (
                <option key={index} value={code.code}>
                  {code.country} ({code.code})
                </option>
              ))}
            </select>

            <div className="w-full">
              <input
                type="number"
                id="phoneNumber"
                placeholder="Enter phone number"
                {...register("phoneNumber", { required: true })}
                className="bg-gray-700 text-white p-2 rounded-md w-full outline-none"
              />
              {errors.phoneNumber && (
                <p className="text-red-400 text-sm mt-1">
                  Phone Number is required.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col">
          <label htmlFor="message" className="text-white text-sm">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            {...register("message", { required: true })}
            className="bg-gray-700 text-white p-2 rounded-md w-full outline-none"
          ></textarea>
          {errors.message && (
            <p className="text-red-400 text-sm mt-1">Message is required.</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md transition duration-200 w-full"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
