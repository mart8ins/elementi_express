const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/ErrorHandling/catchAsync");
const Category = require("../models/category");



router.get("/", catchAsync(async (req, res) => {
    res.render("index")
}))

router.get("/about", catchAsync(async (req, res) => {
    res.render("about")
}))

router.get("/shop", catchAsync(async (req, res) => {
    // categories consists of all categories and also products for each categorie
    const categories = await Category.find({}).populate("products");
    res.render("products/categories", { categories })
}))


module.exports = router;