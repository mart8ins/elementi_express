const express = require("express");
const router = express.Router();
const registrationValidation = require("../utils/ValidationHandling/registrationValidation");

const { renderLoginPage, logInUser, renderRegisterPage, registerUser, logoutUser } = require("../controlers/auth");


/************
 LOGIN PAGE
*************/
router.route("/login")
    .get(renderLoginPage())
    .post(logInUser())

/************
 REGISTER PAGE
*************/
router.route("/register")
    .get(renderRegisterPage())
    .post(registrationValidation, registerUser())

/************
 LOGOUT BUTTON
*************/
router.route("/logout")
    .post(logoutUser())

module.exports = router;