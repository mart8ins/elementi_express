const express = require("express");
const router = express.Router();

const { renderProduct, addProductToCart } = require("../controlers/products");

// product details view
router.route("/:id")
    .get(renderProduct())
    .post(addProductToCart())



module.exports = router;