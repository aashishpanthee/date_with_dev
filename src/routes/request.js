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

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;
    const loggedInUserId = req.user._id;

    const ALLOWED_STATUSES = ["accepted", "rejected"];

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "interested"
    })

    if (!connectionRequest) {
      return res.status(400).json({
        message: "Connection request not found",
      });
    }

    connectionRequest.status = status;
    const updatedConnectionRequest = await connectionRequest.save();

    res.status(200).json({
      message: "Connection request reviewed successfully",
      data: updatedConnectionRequest,
    });

  } catch (error) {
    res.status(400).json({
      message: "Failed to review connection request",
      error: error.message,
    });

  }
})

module.exports = requestRouter;