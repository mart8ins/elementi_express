const express = require("express");
const router = express.Router();
const { loggedUserRouteGuard, loggedUserManageGuard } = require("../utils/Middleware/routeGuarding");

const { renderLoggedUserProfile, createOrEditUserData, renderEditUserDataPage, renderUserOrderHistory, renderChangePasswordPage, changePassword } = require("../controlers/user");

/*****************
    ROUTE GUARD FOR LOGGED USERS
*******************/
router.use(loggedUserRouteGuard);

/* PROFILE INFO AND SETUP */
router.route("/:id/profile")
    .get(loggedUserManageGuard, renderLoggedUserProfile())
    .post(loggedUserManageGuard, createOrEditUserData())

router.route("/:id/profile/edit")
    .get(loggedUserManageGuard, renderEditUserDataPage())

router.route("/:id/profile/change_password")
    .get(loggedUserManageGuard, renderChangePasswordPage())
    .post(loggedUserManageGuard, changePassword())

/* USERS ORDER HISTORY */
router.route("/:id/orders")
    .get(loggedUserManageGuard, renderUserOrderHistory())

module.exports = router;