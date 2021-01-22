const express = require("express");
const router = express.Router();

// categries seed data
const category = require("../seed/category");

// models 
const Product = require("../models/product");
const Category = require("../models/category");

router.get("/products", async (req, res) => {
    const categories = await Category.find({}); // to render all added categories to new product form
    res.render("admin/products/products", { categories })
})

router.post("/products", async (req, res) => {
    const { newProduct, newCategory } = req.body;

    // if new product category is created
    if (newCategory) {
        const createdCategory = await new Category({
            category: newCategory
        })
        await createdCategory.save();
    }

    // if new product is created
    if (newProduct) {
        const cat = await Category.findOne({ category: newProduct.category });
        const createdProduct = await new Product({
            brand: newProduct.brand,
            model: newProduct.model,
            price: {
                new: newProduct.newPrice,
                old: newProduct.oldPrice
            },
            description: newProduct.description,
            category: cat // reference to category
        })
        cat.products.push(createdProduct); // pushing in current category products array a reference to created product
        await cat.save();
        await createdProduct.save();
    }
    res.redirect("/manage/products");
})




router.get("/orders", (req, res) => {
    res.render("admin/orders/orders")
})

module.exports = router;