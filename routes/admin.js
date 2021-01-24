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

/* to add new product or category */
router.post("/products", async (req, res) => {
    const { newProduct, newCategory } = req.body;
    // if new product category is created
    if (newCategory) {
        const createdCategory = await new Category({
            category: newCategory
        })
        await createdCategory.save();
    }
    // if a new product is created
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
            onSale: newProduct.onSale,
            category: cat // reference to category
        })
        cat.products.push(createdProduct); // pushing in current category products array a reference to created product
        await cat.save();
        await createdProduct.save();
    }
    res.redirect("/manage/products");
})

/* update category */
router.patch("/products", async (req, res) => {
    const { categoryToChange } = req.body;
    // change/update category name
    if (categoryToChange) {
        await Category.findOneAndUpdate({ category: categoryToChange.current }, { category: categoryToChange.new }, { useFindAndModify: false });
    }
    res.redirect("/manage/products");
})

/* delete category */
/* LATER i NEED TO UPDATE THIS DELETE OPTIONS TO ALSO DELETE associated PRODUCTS for CATEGORY */
router.delete("/products", async (req, res) => {
    const { categoryID } = req.body;
    if (categoryID) {
        await Category.findByIdAndDelete({ _id: categoryID })
    }
    res.redirect("/manage/products");
})



router.get("/orders", (req, res) => {
    res.render("admin/orders/orders")
})

module.exports = router;