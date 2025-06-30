const express = require('express');
const bcrypt = require('bcrypt');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validatePasswordChangeData } = require('../utils/validation');

const saltRounds = 10;

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.status(200).json({
      message: "Profile data fetched successfully",
      data: user
    });
  } catch (error) {
    res.status(500).send("ERROR. " + error.message);
  }
})

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    const isValidFields = validateEditProfileData(req.body);
    if (!isValidFields) {
      return res.status(400).send("Update not allowed. Please check the fields you are trying to update.");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.status(200).json({
      message: "Profile updated successfully",
      data: loggedInUser
    });
  } catch (error) {
    res.status(500).send("ERROR. " + error.message);
  }
})

profileRouter.patch("/password", userAuth, async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const loggedInUser = req.user;

    await validatePasswordChangeData(password, newPassword, loggedInUser);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res.status(200).json({
      message: "Password updated successfully",
      data: loggedInUser
    });
  } catch (error) {
    return res.status(500).send("ERROR. " + error.message);
  }
})

module.exports = profileRouter;