const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require('../models/connectionRequest');
const { User } = require('../models/user');

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    console.log(typeof fromUserId)
    console.log(typeof toUserId)

    const ALLOWED_STATUSES = ["ignore", "interested"];

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // Check if the recipient user exists
    const isValidRecipientId = await User.findById(toUserId);
    if (!isValidRecipientId) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Check if the connection request already exists

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })

    if (existingConnectionRequest) {
      return res.status(400).json({
        message: "Connection Request Already Sent"
      })
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    })
    const data = await connectionRequest.save();

    res.status(201).json({
      message: "Connection request sent successfully",
      data,
    });
  } catch (error) {
    res.status(400).send({
      message: "Failed to send connection request",
      error: error.message,
    });
  }
})

module.exports = requestRouter;