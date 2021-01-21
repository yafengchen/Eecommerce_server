const express = require("express");
const router = express.Router();
const {
  validateSignUpRequest,
  isRequestValidate,
  validateSignInRequest,
} = require("../../validators/auth");

const { signin, signup, signout } = require("../../controller/admin/auth");
const { requireSignin } = require("../../common-middleware");

router.post("/admin/signin", validateSignInRequest, isRequestValidate, signin);
router.post("/admin/signup", validateSignUpRequest, isRequestValidate, signup);
router.post("/admin/signout", signout);
module.exports = router;
