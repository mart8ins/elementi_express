const express = require("express");
const router = express.Router();
const { loggedUserRouteGuard } = require("../utils/Middleware/routeGuarding")


/*****************
    ROUTE GUARD FOR LOGGED USERS
*******************/
router.use(loggedUserRouteGuard);

/*****************
    error handling
*******************/
const AppError = require("../utils/ErrorHandling/AppError");
const catchAsync = require("../utils/ErrorHandling/catchAsync");

router.get("/:id/profile", catchAsync(async (req, res) => {
    res.render("user/profile");
}))

router.get("/:id/orders", catchAsync(async (req, res) => {
    res.render("user/orders");
}))

module.exports = router;