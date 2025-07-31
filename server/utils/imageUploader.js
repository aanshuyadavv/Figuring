const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImageToCloudinary = async (file, folder, type = "image") => {
  const options = { folder, resource_type: type };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
