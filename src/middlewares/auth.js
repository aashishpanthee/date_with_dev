const jwt = require("jsonwebtoken");
const { User } = require('../models/user');
/**
 * The userAuth function is a middleware in JavaScript that verifies a user's token, finds the user
 * based on the token, and attaches the user to the request object.
 * @param req - `req` is the request object representing the HTTP request made by the client to the
 * server. It contains information about the request such as headers, parameters, body, cookies, etc.
 * In the provided code snippet, `req` is used to access the cookies sent with the request in order to
 * retrieve
 * @param res - The `res` parameter in the `userAuth` function stands for the response object in
 * Express.js. It is used to send a response back to the client making the request. In the provided
 * code snippet, `res` is used to send different HTTP responses based on the outcome of the
 * authentication process
 * @param next - In the context of Express middleware, `next` is a callback function that is used to
 * pass control to the next middleware function in the stack. When called, it executes the next
 * middleware function. If `next` is not called within the current middleware function, the
 * request-response cycle will be terminated,
 * @returns The `userAuth` middleware function is being returned, which is responsible for
 * authenticating and authorizing users based on the token provided in the request cookies.
 */
const userAuth = async (req, res, next) => {

  try {
    // read the token from the req cookies
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
    // verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // find the user
    const { _id } = decodedToken;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // attach the user to the request object
    req.user = user;

    // call the next middleware
    next();

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error: " + error.message });
  }

};

module.exports = {
  userAuth
};
