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
    const loggedUser = await User.findById(userProfileId);
    res.render("user/edit", { loggedUser });
}))



router.post("/:userProfileId/profile", catchAsync(async (req, res) => {
    const { userProfileId } = req.params;
    const { username, firstName, lastName, email, address, phone } = req.body;
    const delivery = {
        firstName,
        lastName,
        phone,
        address
    }
    const loggedUser = await User.findById(userProfileId);
    loggedUser.username = username;
    req.session.user_name = username;
    loggedUser.email = email;
    loggedUser.delivery = delivery;

    await loggedUser.save();

    res.redirect(`/user/${userProfileId}/profile`);
}))









/* USERS ORDER HISTORY */
router.get("/:id/orders", catchAsync(async (req, res) => {
    res.render("user/orders");
}))

module.exports = router;