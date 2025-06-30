const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");


profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("ERROR. " + error.message);
  }
})

profileRouter.patch("/edit", userAuth, async (req, res) => {

})

profileRouter.patch("/password", userAuth, async (req, res) => {

})

module.exports = profileRouter;