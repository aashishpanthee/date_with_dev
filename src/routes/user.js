const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest")

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



module.exports = userRouter;
