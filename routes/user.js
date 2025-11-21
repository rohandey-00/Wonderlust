const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js"); //require for admin data
const User =require("../models/user.js");   // require user model

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isAdmin } = require("../middlewares/islogin.js");

const userController = require("../controllers/user.js");   // Import CONTROLLER file




// /* SIGN UP  */
// router.get("/signup", userController.signupForm);
// router.post("/signup", wrapAsync(userController.userSignup));



// /* LOG IN  */
// router.get("/login", userController.loginForm);
// router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.userLogin);


// /* LOG OUT */
// router.get("/logout", userController.userLogout);


// module.exports = router;

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++           RESTRUCTURE         +++++++++++++++++++++++++++++++++++++++++++++++++++ */


router.route("/signup")
.get( userController.signupForm)
.post( wrapAsync(userController.userSignup));


router.route("/login")
.get( userController.loginForm)
.post( saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.userLogin);  //MAIN CHECK USER Authentication.



router.route("/login/admin")
.get( userController.adminLoginForm)
.post( userController.adminLogin);

router.get("/admin/databasePage", isAdmin, userController.getDB);







router.get("/logout", userController.userLogout);


module.exports = router;
