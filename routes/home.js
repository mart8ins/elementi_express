const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/ErrorHandling/catchAsync");
const Category = require("../models/category");



// landing page, with all categories and products
router.get("/", catchAsync(async (req, res) => {
    res.render("index")
}))

module.exports = router;