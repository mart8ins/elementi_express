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