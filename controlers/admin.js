const cloudinary = require('cloudinary').v2;

/*****************
    models
*******************/
const Category = require("../models/category");
const Product = require("../models/product");
const Order = require("../models/order");

/*****************
    async error catching
*******************/
const catchAsync = require("../utils/ErrorHandling/catchAsync");


module.exports.getProductsCategories = function () {
    return catchAsync(async (req, res, next) => {
        const categories = await Category.find({}); // to render all added categories to new product form
        const products = await Product.find({}).populate("category");
        res.render("admin/products/products", { categories, products })
    })
}

module.exports.createProductOrCategory = function () {
    return catchAsync(async (req, res, next) => {
        const { newProduct, newCategory } = req.body;
        // if new product category is created
        if (newCategory) {
            const createdCategory = await new Category({
                category: newCategory
            })
            req.flash("category-succes", `Successfuly created new category - ${newCategory}!`)
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
                category: cat, // reference to category,
                active: true,
                image: {
                    url: req.file.path,
                    fileName: req.file.filename
                }
            })
            cat.products.unshift(createdProduct); // pushing in current category products array a reference to created product
            req.flash("product-succes", `Successfuly created new product - ${newProduct.brand} ${newProduct.model}!`)
            await cat.save();
            await createdProduct.save();
        }
        res.redirect("/manage/products");
    })
}

module.exports.editCategoryOrProduct = function () {
    return catchAsync(async (req, res) => {
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
    })
}

module.exports.deleteCategory = function () {
    return catchAsync(async (req, res) => {
        const { categoryID } = req.body;
        if (categoryID) {
            await Category.findByIdAndDelete({ _id: categoryID })
        } else {
            throw new AppError("Missing category ID to delete category.", 400)
        }
        res.redirect("/manage/products");
    })
}

module.exports.editProduct = function () {
    return catchAsync(async (req, res) => {
        const { id } = req.params;
        const categories = await Category.find({});
        const product = await Product.findById(id).populate("category");
        res.render("admin/products/edit", { product, categories });
    })
}

module.exports.getOrders = function () {
    return catchAsync(async (req, res) => {
        // all orders
        const ordersAll = await Order.find({}).populate("user");

        // orders depending on status in query
        let { status } = req.query;
        if (status) {
            if (status == "Awaiting_payment") {
                status = "Awaiting payment"
            }
            const ordersByStatus = await Order.find({ currentStatus: { $in: status } }).populate("user");
            res.render("admin/orders/orders", { orders: ordersByStatus })
        } else {
            res.render("admin/orders/orders", { orders: ordersAll })
        }
    })
}

module.exports.getOrderData = function () {
    return catchAsync(async (req, res) => {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate("user");
        res.render("admin/orders/details", { order })
    })
}

module.exports.changeOrderStatusOrComment = function () {
    return catchAsync(async (req, res) => {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (req.body.status_change && req.body.status_change != "") {
            order.currentStatus = req.body.status_change;
            order.statusHistory.push({ status: req.body.status_change, changeDate: new Date().toUTCString() })
        }
        if (req.body.comment) {
            order.comment = req.body.comment;
        }
        await order.save();
        res.redirect(`/manage/orders/${orderId}`)
    })
}

module.exports.deleteOrHideUnhideProduct = function () {
    return catchAsync(
        async (req, res) => {
            const { id } = req.params;
            const { action } = req.query;
            if (action == "delete") {
                const product = await Product.findById({ _id: id });
                // delete product image form cloudinary service
                cloudinary.uploader.destroy(product.image.fileName);
                // delete product from database
                await product.delete();
                res.redirect(`/manage/products`)
            }
            if (action == "hide") {
                const hideUnhide = await Product.findById(id);
                await !hideUnhide.active ? hideUnhide.active = true : hideUnhide.active = false;
                await hideUnhide.save();
                res.redirect(`/manage/products/${id}/edit`)
            }
        }
    )
}