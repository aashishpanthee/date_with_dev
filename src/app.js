const express = require("express");
const databaseConnection = require("./config/database");
const { User } = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth")

const app = express();

// parse the body of the request from json to javascript object (middleware)
app.use(express.json());

// parse the cookies from the request
app.use(cookieParser());

const saltRounds = 10;

app.post("/signup", async (req, res) => {
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
});


app.post("/login", async (req, res) => {
  try {
    const userObj = req.body;
    const { emailId, password } = userObj;
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid credentials");
    }
    // Generate a jwt token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set the token in the cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      expires: new Date(Date.now() + 3600000), // 1 hour
    });
    return res.status(200).send("Logged in successfully");
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("ERROR. " + error.message);
  }
})


app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Something went wrong " + error.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(404).send("No users found");
    }
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send("Something went wrong " + error.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("User not found");
    }
    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong " + error.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userData = req.body;
  const userId = req.params.userId;
  const ALLOWED_UPDATES = ["firstName", "lastName", "age", "gender", "password", "photoUrl", "about", "skills"];
  const IS_ALLOWED_UPDATE = Object.keys(userData).every((key) => ALLOWED_UPDATES.includes(key));

  try {
    if (!IS_ALLOWED_UPDATE) {
      throw new Error("Update not allowed");
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
    }
    const updatedUserData = await User.findByIdAndUpdate(userId, userData, {
      returnDocument: "after",
      runValidators: true,
    });
    return res.status(200).send(updatedUserData);
  } catch (error) {
    res.status(400).send("Something went wrong " + error.message);
  }
});

databaseConnection()
  .then(() => {
    console.log("Database connection successful");
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((error) => {
    console.log("Database connection failed ", error);
  });
