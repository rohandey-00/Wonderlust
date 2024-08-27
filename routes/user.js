const express = require("express");
const router = express.Router();
const User =require("../models/user.js");   // require user model
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares/islogin.js");

const userController = require("../controllers/user.js");   // Import CONTROLLER file



router.route("/signup")
.get( userController.signupForm)
.post( wrapAsync(userController.userSignup));


router.route("/login")
.get( userController.loginForm)
.post( saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.userLogin);


router.get("/logout", userController.userLogout);


module.exports = router;
