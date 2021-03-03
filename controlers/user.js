/*****************
    models
*******************/
const User = require("../models/user");
const Order = require("../models/order");

/*****************
    async error catching
*******************/
const catchAsync = require("../utils/ErrorHandling/catchAsync");



module.exports.renderLoggedUserProfile = function () {
    return catchAsync(async (req, res) => {
        const { id } = req.params;
        const loggedUser = await User.findById(id);
        res.render("user/profile", { loggedUser });
    })
}

module.exports.createOrEditUserData = function () {
    return catchAsync(async (req, res) => {
        const { id } = req.params;
        const { username, firstName, lastName, email, address, phone } = req.body;

        //if user changes its username or email to what already exists for diferent user then
        // error info is sent through query
        const takenUsername = await User.findOne({ username: username });
        const takenEmail = await User.findOne({ email: email });
        if (takenUsername && takenUsername._id != id) {
            res.redirect(`/user/${id}/profile/edit?username_error=true`);
        }
        if (takenEmail && takenEmail._id != id) {
            res.redirect(`/user/${id}/profile/edit?email_error=true`);
        }
        const delivery = {
            firstName,
            lastName,
            phone,
            address
        }
        const loggedUser = await User.findById(id);

        loggedUser.username = username;
        loggedUser.email = email;
        req.session.user_name = username;

        loggedUser.delivery = delivery;
        await loggedUser.save();

        res.redirect(`/user/${id}/profile`);
    })
}

module.exports.renderEditUserDataPage = function () {
    return catchAsync(async (req, res) => {
        const { id } = req.params;
        const { username_error } = req.query;
        const { email_error } = req.query;
        const loggedUser = await User.findById(id);
        res.render("user/edit", { loggedUser, username_error, email_error });
    })
}

module.exports.renderUserOrderHistory = function () {
    return catchAsync(async (req, res) => {
        const { id } = req.params;
        let allOrders = await Order.find({}).populate("user");

        // all users orders
        let userOrders = [];
        for (let order in allOrders) {
            if (allOrders[order].user) {
                if (allOrders[order].user._id == id) {
                    let ord = {
                        products: [],
                        date: allOrders[order].date,
                        statusHistory: allOrders[order].statusHistory,
                        currentStatus: allOrders[order].currentStatus,
                        totalQ: allOrders[order].order.cartTotals.quantity,
                        totalSum: allOrders[order].order.cartTotals.price,
                        delivery: allOrders[order].shipping,
                        orderNumber: allOrders[order].orderNumber
                    }
                    for (let pr in allOrders[order].order.products) {
                        ord.products.push(allOrders[order].order.products[pr])
                    }
                    userOrders.unshift(ord)
                }
            }
        }
        res.render("user/orders", { userOrders });
    })
}

module.exports.renderChangePasswordPage = function () {
    return catchAsync(async (req, res) => {
        const { id } = req.params;
        console.log(id)
        res.render("user/change_password", { id })
    })
}

module.exports.changePassword = function () {
    return catchAsync(async (req, res) => {
        const { id } = req.params;
        const { oldPassword, newPassword, repeatNewPassword } = req.body;
        // const user = await User.findById(id);
        const changedPassword = await User.changePassword(id, oldPassword, newPassword, repeatNewPassword);
        if (changedPassword) {
            req.flash("success", "Password is changed!")
            res.redirect(`/user/${id}/profile`);
        } else {
            req.flash("error", "Old password is incorrect or new passwords dont match!");
            res.redirect(`/user/${id}/profile/change_password`);
        }
    })
}