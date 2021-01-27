const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const catchAsync = require("../utils/ErrorHandling/catchAsync");

// product details view
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/product", { product });
}))



module.exports = router;