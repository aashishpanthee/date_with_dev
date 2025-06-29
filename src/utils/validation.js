const validator = require("validator");

const validateSignUpData = (userObj) => {
  const { firstName, lastName, emailId, password, age, gender, skills, about } = userObj;
  const genderValue = gender.toLowerCase();
  if (!firstName || !emailId || !password || !age || !gender) {
    throw new Error("All the fields are required");
  }
  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name must be between 4 and 50 characters");
  }
  if (lastName && lastName.length > 30) {
    throw new Error("Last name must be less than 30 characters");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Please provide a valid email address");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong");
  }
  if (age < 18) {
    throw new Error("User must be at least 18 years old");
  }
  if (genderValue !== "male" && genderValue !== "female" && genderValue !== "other") {
    throw new Error("Invalid gender");
  }
  if (about && about.length > 500) {
    throw new Error("About cannot have more than 500 characters");
  }
  if (skills && skills.length > 15) {
    throw new Error("Skills cannot have more than 15 items");
  }
};

module.exports = { validateSignUpData };
