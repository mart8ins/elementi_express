/*****************
    models
*******************/
const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");
const Order = require("../models/order");
const Order_Number = require("../models/order_number");

const orderNumberControlId = "60243bf048e05e080ce78ef2";// id for storing/controling order number
const OrderNumberGenerator = require("../utils/orderNumberGenerator");

/*****************
    async error catching
*******************/
const catchAsync = require("../utils/ErrorHandling/catchAsync");

module.exports.renderShoppingCart = function () {
    return catchAsync(async (req, res) => {
        if (req.session.cart) {
            const cart = req.session.cart; // object with product objects where key is product id, value - cart data
            const showCart = [];
            for (let p in cart.products) {  // creating iterrable array
                const product = await Product.findById(p);
                showCart.push({
                    id: p, // mongo product id
                    product: cart.products[p], // product data
                    imageUrl: product.image.url
                })
            }
            return res.render("shopping/cart", { showCart, totals: cart.cartTotals });
        }
        res.render("shopping/emptyCart");
    })
}

module.exports.removeFromShoppingCart = function () {
    return catchAsync(async (req, res) => {
        let productId = req.query.product; // product to remove from cart
        let cart = new Cart(req.session.cart);
        cart.remove(productId); // removes deleted product from cart
        req.session.cart = cart;
        res.redirect("/shopping/cart");
    })
}

module.exports.renderCheckout = function () {
    return catchAsync(async (req, res) => {
        let delivery = {};
        if (req.session.user_id) {
            const user = await User.findById(req.session.user_id);
            delivery = user.delivery;
            delivery.email = user.email;
        }
        res.render("shopping/checkout", { delivery });
    })
}

module.exports.createdNewOrder = function () {
    return catchAsync(async (req, res) => {
        // shipping info
        const { firstName, lastName, phone, email, address } = req.body;
        // shopping cart
        const cart = req.session.cart;

        // checks if order is placed by registred user
        let isRegisterUser = null;
        if (req.session.user_id) {
            isRegisterUser = await User.findById(req.session.user_id);
        }

        // NEW ORDER NUMBER CREATION
        const oldOrderNumber = await Order_Number.findById(orderNumberControlId);
        let newOrderNumber = OrderNumberGenerator(oldOrderNumber.orderNumber);
        // for after checkout to use in locals and show in order success template
        req.session.orderNo = newOrderNumber;

        // SAVES ORDER IN DB
        const newOrder = await new Order({
            user: isRegisterUser ? isRegisterUser : null,
            shipping: {
                firstName,
                lastName,
                phone,
                email,
                address
            },
            statusHistory: [{ status: "Pending", changeDate: new Date().toUTCString() }],
            currentStatus: "Pending",
            date: new Date().toUTCString(),
            order: cart,
            orderNumber: newOrderNumber
        })

        // { status: "Processing", changeDate: new Date() }, { status: "Awaiting payment", changeDate: new Date() },{ status: "Shipped", changeDate: new Date() }, { status: "Completed", changeDate: new Date() }, { status: "Canceled", changeDate: new Date() }
        // SAVES REFERANCE FOR LATEST ORDER NUMBER IN ORDER NUMBER TRACKER
        oldOrderNumber.orderNumber = newOrderNumber;
        oldOrderNumber.save();
        await newOrder.save();

        // SETS EMPTY SHOPPING CART
        req.session.cart = null;

        res.redirect("/shopping/orderSuccess");
    })
}

module.exports.renderOrderSuccessPage = function () {
    return catchAsync(async (req, res) => {
        req.session.orderNo = null;
        res.render("shopping/orderSuccess");
    })
}