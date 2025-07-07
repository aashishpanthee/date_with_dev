const validator = require("validator");
const bcrypt = require("bcrypt");

/**
 * The function `validateSignUpData` validates the sign-up data provided by a user to ensure all
 * required fields meet specific criteria.
 * @param userObj - The `validateSignUpData` function takes a `userObj` parameter which should be an
 * object containing the following properties:
 */
const validateSignUpData = (userObj) => {
  const { firstName, lastName, emailId, password } = userObj;
  if (!firstName || !emailId || !password) {
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
};

/**
 * The function `validateEditProfileData` checks if the fields in a user object are allowed for editing
 * based on a predefined list of allowed fields.
 * @param userObj - The `userObj` parameter in the `validateEditProfileData` function is an object that
 * contains the fields and values that a user wants to update in their profile. 
 * @returns The function `validateEditProfileData` returns a boolean value indicating whether all the
 * fields in the `userObj` parameter are allowed for update based on the `allowedEditFields` array.
 */
const validateEditProfileData = (userObj) => {
  const allowedEditFields = ["firstName", "lastName", "age", "gender", "password", "photoUrl", "about", "skills"];
  const IS_ALLOWED_UPDATE = Object.keys(userObj).every((field) => allowedEditFields.includes(field));
  return IS_ALLOWED_UPDATE;
}

/**
 * The function `validatePasswordChangeData` ensures that the old and new passwords meet certain
 * criteria for a logged-in user.
 * @param oldPassword - The `oldPassword` parameter represents the current password of the logged-in
 * user.
 * @param newPassword - The `newPassword` parameter in the `validatePasswordChangeData` function
 * represents the new password that the user wants to change to.
 * @param loggedInUser - loggedInUser is an object representing the user who is currently logged in. It
 * likely contains information such as the user's username, email, and methods to verify the user's
 * password.
 */
const validatePasswordChangeData = async (oldPassword, newPassword, loggedInUser) => {
  if (!oldPassword || !newPassword) {
    throw new Error("Both old and new passwords are required");
  }

  const isOldPasswordValid = await loggedInUser.verifyPassword(oldPassword);
  if (!isOldPasswordValid) {
    throw new Error("Password is not valid");
  }

  if (oldPassword === newPassword) {
    throw new Error("New password must be different from old password");
  }
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("New password must be strong");
  }
};

module.exports = { validateSignUpData, validateEditProfileData, validatePasswordChangeData };
