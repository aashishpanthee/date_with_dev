const { Schema, default: mongoose } = require("mongoose");
const validator = require("validator");

const gender = ["male", "female", "other"];

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "FirstName is required"],
      minLength: [4, "First name must be at least 3 characters long"],
      maxLength: [50, "First name must be less than 25 characters long"],
    },
    lastName: {
      type: String,
      maxLength: [30, "Last name must be less than 25 characters long"],
    },
    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        // • Password must be at least 8 characters long
        // • Password must contain at least 1 uppercase letter(s)
        // • Password must contain at least 1 number(s)
        // • Password must contain at least 1 special character(s)
        if (!validator.isEmail(value)) {
          throw new Error("Please provide a valid email address");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password must be strong");
        }
      },
    },
    age: {
      type: Number,
      min: [18, "User must be at least 18 years old"],
    },
    gender: {
      type: String,
      enum: {
        values: gender,
        message: "Invalid gender",
      },
      lowercase: true,
      required: [true, "Gender is required"],
    },
    photoUrl: {
      type: String,
      default: "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Please provide a valid URL for the photo");
        }
      },
    },
    about: {
      type: String,
      default: "No information provided",
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 15;
        },
        message: "Skills cannot have more than 15 items",
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
