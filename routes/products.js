const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/ErrorHandling/catchAsync");
const Category = require("../models/category");
const { renderProduct, addProductToCart } = require("../controlers/products");

// product details view
router.route("/")
    .get(catchAsync(async (req, res) => {
        const categories = await Category.find({}).populate("products");
        res.render("products/index", { categories })
    }))

router.route("/:id")
    .get(renderProduct())
    .post(addProductToCart())



module.exports = router;