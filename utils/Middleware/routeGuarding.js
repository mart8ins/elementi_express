const AppError = require("../ErrorHandling/AppError");

module.exports.adminRouteGuard = function (req, res, next) {
    if (!req.session.isAdmin) {
        res.redirect("/");
    }
    next();
}

module.exports.loggedUserRouteGuard = function (req, res, next) {
    if (!req.session.user_id) {
        res.redirect("/");
    }
    next();
}

module.exports.loggedUserManageGuard = function (req, res, next) {
    if (req.session.user_id != req.params.id) {
        throw new AppError("You are not allowed to access or manage this data!", 403)
    }
    next();
}

module.exports.checkoutRouteGuard = function (req, res, next) {
    if (!req.session.cart) {
        res.redirect("/");
    }
    next();
}

module.exports.orderSuccessRouteGuard = function (req, res, next) {
    if (!req.session.orderNo) {
        res.redirect("/");
    }
    next();
}