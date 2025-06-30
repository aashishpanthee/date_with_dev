const express = require("express");
const databaseConnection = require("./config/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();

// parse the body of the request from json to javascript object (middleware)
app.use(express.json());

// parse the cookies from the request
app.use(cookieParser());

/* The code `app.use("/auth", authRouter); app.use("/profile", profileRouter); app.use("/requests",
requestRouter);` is setting up middleware in the Express application. */
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

/* This code snippet is establishing a connection to the database using the `databaseConnection`
function. It then uses a Promise chain with `.then()` and `.catch()` to handle the success and
failure scenarios of the database connection. */
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
