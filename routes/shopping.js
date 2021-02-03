const express = require("express");
const router = express.Router();

/*****************
    error handling
*******************/
const AppError = require("../utils/ErrorHandling/AppError");
const catchAsync = require("../utils/ErrorHandling/catchAsync");

router.get("/cart", (req, res) => {
    res.render("shopping/cart");
})

router.post("/cart", (req, res) => {
    res.render("shopping/cart");
})

router.get("/checkout", (req, res) => {
    res.render("shopping/checkout");
})

module.exports = router;