const jwt = require("jsonwebtoken");
const { User } = require('../models/user');
const userAuth = async (req, res, next) => {

  try {
    // read the token from the req cookies
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      return res.status(401).send("Unauthorized: Invalid or expired token");
    }
    // verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // find the user
    const { _id } = decodedToken;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    // attach the user to the request object
    req.user = user;

    // call the next middleware
    next();

  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }

};

module.exports = {
  userAuth
};
