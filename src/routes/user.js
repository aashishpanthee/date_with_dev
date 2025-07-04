const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require('../models/user');

const userRouter = express.Router();

const ALLOWED_USER_DATA = ["firstName", "lastName", "photoUrl", "about", "skills", "gender", "age"];

// get all the pending connection requests for the logged-in user (interested connections)
userRouter.get("/requests", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const requests = await ConnectionRequest.find({ toUserId: loggedInUserId, status: "interested" }).populate("fromUserId", ALLOWED_USER_DATA);
    return res.status(200).json({
      message: "Data fetched Successfully",
      data: requests
    });
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

// get all the connections for the logged-in user (accepted connections)
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUserId, status: "accepted" },
        { fromUserId: loggedInUserId, status: "accepted" }
      ]
    }).populate("fromUserId", ALLOWED_USER_DATA).populate("toUserId", ALLOWED_USER_DATA);
    const user = connections.map((row) => {
      if (row.fromUserId.equals(loggedInUserId)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    return res.status(200).json({
      message: "Data fetched Successfully",
      data: user
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})


// get all the users in the feed (excluding logged-in user and users with pending connection requests)
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // find all connection requests (sent + received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId },
        { toUserId: loggedInUserId }
      ]
    }).select("fromUserId toUserId").populate("fromUserId", ALLOWED_USER_DATA).populate("toUserId", ALLOWED_USER_DATA);

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      if (request.fromUserId._id.equals(loggedInUserId)) {
        hideUsersFromFeed.add(request.toUserId._id.toString());
      } else {
        hideUsersFromFeed.add(request.fromUserId._id.toString());
      }
    });

    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUserId } },
        { _id: { $nin: Array.from(hideUsersFromFeed) } }
      ]
    }).select(ALLOWED_USER_DATA).skip(skip).limit(limit);


    return res.status(200).json({
      message: "Data fetched Successfully",
      data: users
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})



module.exports = userRouter;
