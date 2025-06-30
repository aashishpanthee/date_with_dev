const express = require('express');
const { validateSignUpData } = require('../utils/validation');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

const saltRounds = 10;
authRouter.post("/signup", async (req, res) => {
  try {
    const userObj = req.body;
    validateSignUpData(userObj);
    const { firstName, lastName, emailId, password, age, gender } = userObj;

    const existingUser = await User.findOne({ emailId: userObj.emailId });
    if (existingUser) {
      return res.status(400).send("User already exists with this email id");
    }
    // create a new instance of the User model
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ firstName, lastName, emailId, password: hashedPassword, age, gender });
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
})


authRouter.post("/login", async (req, res) => {
  try {
    const userObj = req.body;
    const { emailId, password } = userObj;
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    const isPasswordCorrect = await user.verifyPassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid credentials");
    }

    // Generate a jwt token
    const token = await user.getJWT();

    // Set the token in the cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      expires: new Date(Date.now() + 3600000), // 1 hour
    });
    return res.status(200).send("Logged in successfully");
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
})

module.exports = authRouter;