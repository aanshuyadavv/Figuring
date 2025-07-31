const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
    validate: {
      validator: function (value) {
        const dob = new Date(value);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }

        return age >= 16 && age <= 90;
      },
      message: "Age must be between 16 and 90 years",
    },
  },

  about: {
    type: String,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
