const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const AppError = require("../utils/ErrorHandling/AppError");
const catchAsync = require("../utils/ErrorHandling/catchAsync");
const registrationValidation = require("../utils/ValidationHandling/registrationValidation")


/************
 LOGIN PAGE
*************/
router.get("/login", (req, res) => {
    res.render("auth/login");
})

router.post("/login", catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const checkedUser = await User.validateUser(username, password);
    if (checkedUser) {
        req.session.user_id = checkedUser._id;
        req.session.user_name = checkedUser.username;
        if (checkedUser.admin) {
            req.session.isAdmin = true;
        }
        res.redirect("/")
    } else {
        req.flash("error", "Username or password is not correct!");
        res.redirect("/auth/login")
    }
}))

/************
 REGISTER PAGE
*************/
router.get("/register", (req, res) => {
    res.locals.invalidRegistration = "";
    res.render("auth/register");
})

router.post("/register", registrationValidation, catchAsync(async (req, res) => {
    const { username, password, email } = req.body;
    if (username && password && email) {
        const hash = await bcrypt.hash(password, 12);
        const newUser = await new User({
            username,
            password: hash,
            email
            // ,
            // admin: true
            // if want add a user as admin unhide admin: true and register user
        })
        req.session.user_id = newUser._id;
        req.session.user_name = newUser.username;
        if (newUser.admin) {
            req.session.isAdmin = true;
        }
        await newUser.save();
        res.redirect("/");
    }
}))

/************
 LOGOUT BUTTON
*************/
router.post("/logout", catchAsync((req, res) => {
    req.session.user_id = null;
    req.session.user_name = null;
    req.session.isAdmin = null;
    res.redirect("/");
}))

module.exports = router;