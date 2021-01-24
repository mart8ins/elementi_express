const express = require("express");
const router = express.Router();

const Category = require("../models/category");

router.get("/", async (req, res) => {
    const categories = await Category.find({}).populate("products");
    res.render("products/index", { categories })
})

module.exports = router;