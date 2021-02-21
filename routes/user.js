const express = require("express");
const router = express.Router();
const { loggedUserRouteGuard, loggedUserManageGuard } = require("../utils/Middleware/routeGuarding");

const { renderLoggedUserProfile, createOrEditUserData, renderEditUserDataPage, renderUserOrderHistory } = require("../controlers/user");

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


/* USERS ORDER HISTORY */
router.route("/:id/orders")
    .get(loggedUserManageGuard, renderUserOrderHistory())

module.exports = router;