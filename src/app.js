const express = require("express");
const databaseConnection = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');

const app = express();

/* `app.use(cors())` is setting up CORS (Cross-Origin Resource Sharing) middleware in the Express
application. CORS is a security feature implemented by browsers to restrict web pages from making
requests to a different domain than the one that served the original web page. By using `cors()`,
you are allowing your server to handle requests from different origins, enabling cross-origin
communication between your server and clients. */
app.use(cors({
  "origin": "http://localhost:5173",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  credentials: true
}))

// parse the body of the request from json to javascript object (middleware)
app.use(express.json());

// parse the cookies from the request
app.use(cookieParser());

/* The code `app.use("/auth", authRouter); app.use("/profile", profileRouter); app.use("/requests",
requestRouter); etc` is setting up middleware in the Express application. */
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

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
