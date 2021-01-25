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


/* update category OR edit product */
router.patch("/products", catchAsync(async (req, res) => {
    const { categoryToChange, editProduct } = req.body;
    // change/update category name
    if (categoryToChange) {
        await Category.findOneAndUpdate({ category: categoryToChange.current }, { category: categoryToChange.new }, { useFindAndModify: false });
    }

    // edit product
    if (editProduct) {
        // possible new or current products category for update (not update)
        const cat = await Category.findOne({ category: editProduct.category }).populate("products");

        // product to update ID
        const { id } = req.query;

        // getting products existing category before updating
        const productBeforeUpdate = await Product.findById(id).populate("category");
        const categoryIdforUpdatePurpose = productBeforeUpdate.category._id; // id for category in ref
        const categoryBeforeUpdate = productBeforeUpdate.category.category; // name for category

        // updates edited product
        const updatedProduct = await Product.findByIdAndUpdate({ _id: id }, {
            brand: editProduct.brand,
            model: editProduct.model,
            price: {
                new: editProduct.newPrice,
                old: editProduct.oldPrice
            },
            description: editProduct.description,
            onSale: editProduct.onSale
            ,
            category: cat // reference to category
        }, { new: true, useFindAndModify: false });

        /* *******************************************
        if category changes then in old category i need to delete reference to the product, 
           and add products reference to new category.
        ***********************************************/
        const updatedCategoryProductRef = [];
        if (editProduct.category != categoryBeforeUpdate) {
            /* adding new product in category product list/products ref if category changes */
            cat.products.forEach((product) => {
                if (product._id != id) {
                    updatedCategoryProductRef.push(product);
                }
            });
            updatedCategoryProductRef.push(updatedProduct);
            cat.products = updatedCategoryProductRef;
            cat.save();
            /* deleting products ref from old category */
            const categoryToDeleteProductsRef = await Category.findById(categoryIdforUpdatePurpose).populate("products");
            const allProducts = categoryToDeleteProductsRef.products;
            const categoryForProductsRefUpdate = [];
            for (let i of allProducts) {
                if (i._id != id) {
                    categoryForProductsRefUpdate.push(i);
                }
            }
            categoryToDeleteProductsRef.products = categoryForProductsRefUpdate;
            categoryToDeleteProductsRef.save();
        }
    }
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

// edit specific product
router.get("/products/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const categories = await Category.find({});
    const product = await Product.findById(id).populate("category");
    res.render("admin/products/edit", { product, categories });
}))




router.get("/orders", (req, res) => {
    res.render("admin/orders/orders")
})

module.exports = router;