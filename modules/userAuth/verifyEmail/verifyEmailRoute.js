const express = require("express");
const router = express.Router();
const verifyEmailController = require("./verifyEmailController");

router.post("/verifyEmail", verifyEmailController.verifyEmail);

module.exports = router;