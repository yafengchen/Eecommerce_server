const express = require("express");
const router = express.Router();
const { signin, signup } = require("../controller/auth");
const {
  validateSignUpRequest,
  isRequestValidate,
  validateSignInRequest,
} = require("../validators/auth");

router.post("/signin", validateSignInRequest, isRequestValidate, signin);
router.post("/signup", validateSignUpRequest, isRequestValidate, signup);
router.post("/signout");

module.exports = router;
