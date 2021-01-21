const express = require("express");
const router = express.Router();

router.get("/products", (req, res) => {
    res.render("admin/products/products")
})

router.get("/orders", (req, res) => {
    res.render("admin/orders/orders")
})

module.exports = router;