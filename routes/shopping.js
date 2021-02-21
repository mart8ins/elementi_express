const express = require("express");
const router = express.Router();
const { checkoutRouteGuard, orderSuccessRouteGuard } = require("../utils/Middleware/routeGuarding");
const { renderShoppingCart, removeFromShoppingCart, renderCheckout, createdNewOrder, renderOrderSuccessPage } = require("../controlers/shopping")

router.route("/cart")
    .get(renderShoppingCart())
    .post(removeFromShoppingCart())

router.route("/checkout")
    .get(checkoutRouteGuard, renderCheckout())
    .post(checkoutRouteGuard, createdNewOrder())

router.route("/orderSuccess")
    .get(orderSuccessRouteGuard, renderOrderSuccessPage())


module.exports = router;