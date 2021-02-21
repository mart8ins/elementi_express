const express = require("express");
const router = express.Router();
const { adminRouteGuard } = require("../utils/Middleware/routeGuarding");

const {
    getProductsCategories,
    createProductOrCategory,
    editCategoryOrProduct,
    deleteCategory,
    editProduct,
    getOrders,
    getOrderData,
    changeOrderStatusOrComment } = require("../controlers/admin");

/*****************
middleware for product input validation
*******************/
const productValidation = require("../utils/ValidationHandling/productValidation");
const categoryValidation = require("../utils/ValidationHandling/categoryValidation");


/*****************
    ROUTE GUARD FOR ADMIN
*******************/
router.use(adminRouteGuard);

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
router.route("/products")
    .get(getProductsCategories())
    .post(productValidation, categoryValidation, createProductOrCategory())
    .patch(editCategoryOrProduct())
    .delete(deleteCategory())

router.get("/products/:id/edit", editProduct())

router.route("/orders")
    .get(getOrders())

router.route("/orders/:orderId")
    .get(getOrderData())
    .post(changeOrderStatusOrComment())


module.exports = router;