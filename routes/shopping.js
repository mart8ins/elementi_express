const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");

/*****************
    error handling
*******************/
const AppError = require("../utils/ErrorHandling/AppError");
const catchAsync = require("../utils/ErrorHandling/catchAsync");


router.get("/cart", catchAsync(async (req, res) => {
    if (req.session.cart) {
        const cart = req.session.cart; // object with product objects where key is product id, value - cart data
        const showCart = [];
        for (let p in cart.products) {  // creating iterrable array
            showCart.push({
                id: p, // mongo product id
                product: cart.products[p] // product data
            })
        }
        return res.render("shopping/cart", { showCart, totals: cart.cartTotals });
    }
    res.render("shopping/emptyCart");
}))

router.post("/cart", catchAsync(async (req, res) => {
    let productId = req.query.product; // product to remove from cart
    let cart = new Cart(req.session.cart);
    cart.remove(productId); // removes deleted product from cart
    req.session.cart = cart;
    res.redirect("/shopping/cart");
}))

router.get("/checkout", catchAsync(async (req, res) => {
    res.render("shopping/checkout");
}))

module.exports = router;