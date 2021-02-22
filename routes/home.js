const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/ErrorHandling/catchAsync");



// landing page, with all categories and products
router.get("/", catchAsync(async (req, res) => {
    res.render("index")
}))

router.get("/about", catchAsync(async (req, res) => {
    res.render("about")
}))

module.exports = router;