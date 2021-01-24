const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const Category = require("../models/category");

router.get("/", catchAsync(async (req, res) => {
    const categories = await Category.find({}).populate("products");
    res.render("products/index", { categories })
}))

module.exports = router;