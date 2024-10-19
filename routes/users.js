const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync") //error handling

const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users")

router.get("/register",users.renderregister)
router.post("/register", catchAsync(users.register))

router.get("/login", users.renderlogin)

//https://www.passportjs.org/concepts/authentication/middleware/
router.post('/login', storeReturnTo,
    passport.authenticate("local", { failureFlash: true, failureRedirect: '/login' }),users.login )

//,logout need a callback function
router.get("/logout", users.logout )

/* Restructuring

router.route("/register")
    .get(users.renderregister)
    .post(catchAsync(users.register))

router.route("/login")
    .get(users.renderlogin)

    //https://www.passportjs.org/concepts/authentication/middleware/
    .post(storeReturnTo,
        passport.authenticate("local", { failureFlash: true, failureRedirect: '/login' }), users.login)

//,logout need a callback function
router.get("/logout", users.logout)

*/

module.exports = router;