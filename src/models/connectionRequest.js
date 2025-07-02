const { Schema, default: mongoose } = require("mongoose");

const connectionRequestSchema = new Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["rejected", "accepted", "ignore", "interested"],
      message: "Invalid status",
    },
  }
},
  { timestamps: true }
);


/* The line `connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });` in the
provided code snippet is creating a compound index on the `fromUserId` and `toUserId` fields within
the `connectionRequestSchema`. */
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

/* The code snippet `connectionRequestSchema.pre("save", function () { ... })` is setting up a pre-save
hook in the Mongoose schema. This hook will be executed before saving a new document of the
`ConnectionRequest` model to the database.
and checks if the `fromUserId` and `toUserId` are the same. If they are, it throws an error indicating that a user cannot send a connection request to themselves.
*/
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);


module.exports = {
  ConnectionRequest
}
