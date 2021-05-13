/*****************
    models
*******************/
const User = require("../models/user");

/*****************
    async error catching
*******************/
const catchAsync = require("../utils/ErrorHandling/catchAsync");

/*****************
    password hashing
*******************/
const bcrypt = require("bcrypt");


module.exports.renderLoginPage = function () {
    return (req, res) => {
        res.render("auth/login");
    }
}

module.exports.logInUser = function () {
    return catchAsync(async (req, res) => {
        const { password } = req.body;
        const username = req.body.username.toLowerCase();
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
    })
}

module.exports.renderRegisterPage = function () {
    return (req, res) => {
        res.render("auth/register");
    }
}

module.exports.registerUser = function () {
    return catchAsync(async (req, res) => {
        const { password } = req.body;
        const username = req.body.username;
        const email = req.body.email;

        if (username && password && email) {
            const hash = await bcrypt.hash(password, 12);
            const newUser = await new User({
                username: username.toLowerCase(),
                password: hash,
                email: email.toLowerCase()
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
    })
}

module.exports.logoutUser = function () {
    return catchAsync(async (req, res) => {
        req.session.user_id = null;
        req.session.user_name = null;
        req.session.isAdmin = null;
        res.redirect("/");
    })
}