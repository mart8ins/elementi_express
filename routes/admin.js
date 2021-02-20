const express = require("express");
const router = express.Router();
const { adminRouteGuard } = require("../utils/Middleware/routeGuarding");
const Order = require("../models/order");


/*****************
    ROUTE GUARD FOR ADMIN
*******************/
router.use(adminRouteGuard);

/*****************
    error handling
*******************/
const AppError = require("../utils/ErrorHandling/AppError");
const catchAsync = require("../utils/ErrorHandling/catchAsync");

/*****************
    models
*******************/
const Product = require("../models/product");
const Category = require("../models/category");

/*****************
    middleware for product input validation
*******************/
const productValidation = require("../utils/ValidationHandling/productValidation");
const categoryValidation = require("../utils/ValidationHandling/categoryValidation");

/*****************
    middleware for category, product creation succes message
*******************/
router.use((req, res, next) => {
    res.locals.messageCategory = req.flash("category-succes"); // locals var nostorot key un value, kas automātiski ar responsu nodos key vērtību, ja tā templatā tiks saukta 
    res.locals.messageProduct = req.flash("product-succes");
    next();
})

/*****************
    admin routes
*******************/
router.get("/products", catchAsync(async (req, res, next) => {
    const categories = await Category.find({}); // to render all added categories to new product form
    const products = await Product.find({}).populate("category");
    res.render("admin/products/products", { categories, products })
}))
/* to add new product or category */
router.post("/products", productValidation, categoryValidation, catchAsync(async (req, res, next) => {
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
            category: cat // reference to category
        })
        cat.products.unshift(createdProduct); // pushing in current category products array a reference to created product
        req.flash("product-succes", `Successfuly created new product - ${newProduct.brand} ${newProduct.model}!`)
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


router.get("/orders", catchAsync(async (req, res) => {
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

}))


router.get("/orders/:orderId", catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("user");
    // console.log(order)
    res.render("admin/orders/details", { order })
}))

router.post("/orders/:orderId", catchAsync(async (req, res) => {
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
    // console.log(order)
    console.log(req.body)
    res.redirect(`/manage/orders/${orderId}`)
}))

// statusHistory: [
//     { status: 'Pending', changeDate: 'Sat, 20 Feb 2021 16:51:53 GMT' }
//   ],
//   currentStatus: 'Pending'


// {
//     shipping: {
//       firstName: 'Mārtiņš',
//       lastName: 'Šķiņķis',
//       phone: '29141645',
//       email: 'martins_skinkis@inbox.lv',
//       address: 'Cēsu iela'
//     },
//     _id: 602ea1bf766cc142a425d32b,
//     user: 601ab36b7f6d2e427cb93e29,
//     status: [ [Object] ],
//     date: 'Thu Feb 18 2021 19:19:59 GMT+0200 (GMT+02:00)',
//     order: { products: [Object], cartTotals: [Object] },
//     orderNumber: 'E77',
//     __v: 0
//   }

// { status: "Processing", changeDate: new Date() }, { status: "Awaiting payment", changeDate: new Date() },{ status: "Shipped", changeDate: new Date() }, { status: "Completed", changeDate: new Date() }, { status: "Canceled", changeDate: new Date() } 

module.exports = router;