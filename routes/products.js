const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/ErrorHandling/catchAsync");
const Category = require("../models/category");
const { renderProduct, addProductToCart } = require("../controlers/products");

// all products for specific category
router.route("/:categoryId")
    .get(catchAsync(async (req, res) => {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId).populate("products");
        res.render("products/products", { category })
    }))

// product details page
router.route("/:categoryId/:productId")
    .get(renderProduct())
    .post(addProductToCart())



module.exports = router;