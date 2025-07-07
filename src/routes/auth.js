const express = require('express');
const { validateSignUpData } = require('../utils/validation');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

const saltRounds = 10;

const ALLOWED_USER_DATA = ["firstName", "lastName", "photoUrl", "about", "skills", "gender", "age"];
authRouter.post("/signup", async (req, res) => {
  try {
    const userObj = req.body;
    validateSignUpData(userObj);
    const { firstName, lastName, emailId, password, age, gender } = userObj;

    const existingUser = await User.findOne({ emailId: userObj.emailId });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email id" });
    }
    // create a new instance of the User model
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ firstName, lastName, emailId, password: hashedPassword, age, gender });
    const savedUser = await user.save();

    // Generate a jwt token
    const token = await savedUser.getJWT();

    // Set the token in the cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      expires: new Date(Date.now() + 3600000), // 1 hour
    });

    // Filter user data to only include allowed fields
    const filteredUserData = {};
    ALLOWED_USER_DATA.forEach(field => {
      if (savedUser[field] !== undefined) {
        filteredUserData[field] = savedUser[field];
      }
    });

    return res.status(201).json({
      message: "User created successfully",
      data: filteredUserData
    });
  } catch (error) {
    res.status(500).json({ message: "ERROR: " + error.message });
  }
})


authRouter.post("/login", async (req, res) => {
  try {
    const userObj = req.body;
    const { emailId, password } = userObj;
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.verifyPassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a jwt token
    const token = await user.getJWT();

    // Set the token in the cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      expires: new Date(Date.now() + 3600000), // 1 hour
    });

    // Filter user data to only include allowed fields
    const filteredUserData = {};
    ALLOWED_USER_DATA.forEach(field => {
      if (user[field] !== undefined) {
        filteredUserData[field] = user[field];
      }
    });

    return res.status(200).json({
      message: "Login successful",
      data: filteredUserData
    });
  } catch (error) {
    res.status(500).json({
      message: "ERROR: " + error.message
    });
  }
})

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now() - 1000), // Set the cookie to expire immediately
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    });
    return res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "ERROR: " + error.message
    });
  }
})

module.exports = authRouter;