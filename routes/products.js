const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const catchAsync = require("../utils/ErrorHandling/catchAsync");
const Cart = require("../models/cart");

// product details view
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/product", { product });
}))



router.post("/:id", catchAsync(async (req, res) => {
    const { id } = req.params; // product id
    const { quantity } = req.body.product; // quantity added to cart
    if (quantity) {
        let cart = new Cart(req.session.cart ? req.session.cart : { products: {} });
        let addedProduct = await Product.findById(id);

        await cart.add(addedProduct, parseInt(quantity));
        req.session.cart = cart;
    }
    res.redirect(`/products/${id}`);
}))



module.exports = router;