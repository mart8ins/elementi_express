/*****************
    models
*******************/
const Product = require("../models/product");
const Cart = require("../models/cart");

/*****************
    async error catching
*******************/
const catchAsync = require("../utils/ErrorHandling/catchAsync");


module.exports.renderProduct = function () {
    return catchAsync(async (req, res) => {
        const { productId, categoryId } = req.params;
        const product = await Product.findById(productId);
        res.render("products/product", { product, categoryId });
    })
}

module.exports.addProductToCart = function () {
    return catchAsync(async (req, res) => {
        const { productId, categoryId } = req.params; // product id
        const { quantity } = req.body.product; // quantity added to cart
        if (quantity) {
            let cart = new Cart(req.session.cart ? req.session.cart : { products: {} });
            let addedProduct = await Product.findById(productId);

            await cart.add(addedProduct, parseInt(quantity));
            req.session.cart = cart;
        }
        res.redirect(`/products/${categoryId}/${productId}`);
    })
}