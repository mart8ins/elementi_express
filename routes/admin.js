const express = require("express");
const router = express.Router();
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Joi = require("Joi");

// categries seed data
const category = require("../seed/category");

// models 
const Product = require("../models/product");
const Category = require("../models/category");


router.get("/products", catchAsync(async (req, res, next) => {
    const categories = await Category.find({}); // to render all added categories to new product form
    const products = await Product.find({}).populate("category");
    console.log(products)
    res.render("admin/products/products", { categories, products })
}))

/* to add new product or category */
router.post("/products", catchAsync(async (req, res, next) => {
    //validation for input value when creating new product or category, usin "Joi" dependencie
    const adminProductCategorySchema = Joi.object({
        newProduct: Joi.object({
            brand: Joi.string().min(3).alphanum().required(),
            model: Joi.string().min(2).alphanum().required(),
            newPrice: Joi.number().min(0).required(),
            oldPrice: Joi.number().min(0),
            category: Joi.string().min(4),
            onSale: Joi.boolean(),
            description: Joi.string()
        }),
        newCategory: Joi.string().min(4)
    })

    const validationResult = adminProductCategorySchema.validate(req.body);
    const { error } = validationResult; // error ir array ar objektiem, erroriem

    if (error) {
        const msg = error.details.map(el => el.message).join(","); // izmapojam cauri un atgriežam error msg, ja ir vairāki, tad join
        throw new AppError(msg, 404)
    }

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
        cat.products.unshift(createdProduct); // pushing in current category products array a reference to created product
        await cat.save();
        await createdProduct.save();

    }
    res.redirect("/manage/products");
}))

/* update category */
router.patch("/products", catchAsync(async (req, res) => {
    if (!req.body) throw new AppError("Cant update category, missing request data", 400);
    const { categoryToChange } = req.body;
    // change/update category name
    await Category.findOneAndUpdate({ category: categoryToChange.current }, { category: categoryToChange.new }, { useFindAndModify: false });
    res.redirect("/manage/products");
}))

/* delete category */
/* LATER i NEED TO UPDATE THIS DELETE OPTIONS TO ALSO DELETE associated PRODUCTS for CATEGORY */
router.delete("/products", catchAsync(async (req, res) => {
    const { categoryID } = req.body;
    if (categoryID) {
        await Category.findByIdAndDelete({ _id: categoryID })
    } else {
        throw new AppError("Missing category ID to delete category.", 400)
    }
    res.redirect("/manage/products");
}))



router.get("/orders", (req, res) => {
    res.render("admin/orders/orders")
})

module.exports = router;