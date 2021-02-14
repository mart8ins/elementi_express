const express = require("express");
const router = express.Router();
const { loggedUserRouteGuard } = require("../utils/Middleware/routeGuarding");
const User = require("../models/user");



/*****************
    ROUTE GUARD FOR LOGGED USERS
*******************/
router.use(loggedUserRouteGuard);

/*****************
    error handling
*******************/
const AppError = require("../utils/ErrorHandling/AppError");
const catchAsync = require("../utils/ErrorHandling/catchAsync");

/* PROFILE INFO AND SETUP */
router.get("/:userProfileId/profile", catchAsync(async (req, res) => {
    const { userProfileId } = req.params;
    const loggedUser = await User.findById(userProfileId);
    res.render("user/profile", { loggedUser });
}))



router.get("/:userProfileId/profile/edit", catchAsync(async (req, res) => {
    const { userProfileId } = req.params;
    const { username_error } = req.query;
    const { email_error } = req.query;
    const loggedUser = await User.findById(userProfileId);

    res.render("user/edit", { loggedUser, username_error, email_error });
}))


router.post("/:userProfileId/profile", catchAsync(async (req, res) => {
    const { userProfileId } = req.params;
    const { username, firstName, lastName, email, address, phone } = req.body;

    //if user changes its username or email to what already exists for diferent user then
    // error info is sent through query
    const takenUsername = await User.findOne({ username: username });
    const takenEmail = await User.findOne({ email: email });
    if (takenUsername && takenUsername._id != userProfileId) {
        res.redirect(`/user/${userProfileId}/profile/edit?username_error=true`);
    }
    if (takenEmail && takenEmail._id != userProfileId) {
        res.redirect(`/user/${userProfileId}/profile/edit?email_error=true`);
    }


    const delivery = {
        firstName,
        lastName,
        phone,
        address
    }
    const loggedUser = await User.findById(userProfileId);

    loggedUser.username = username;
    loggedUser.email = email;
    req.session.user_name = username;

    loggedUser.delivery = delivery;
    await loggedUser.save();

    res.redirect(`/user/${userProfileId}/profile`);
}))









/* USERS ORDER HISTORY */
router.get("/:id/orders", catchAsync(async (req, res) => {
    res.render("user/orders");
}))

module.exports = router;