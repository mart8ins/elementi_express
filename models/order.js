const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    shipping: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true }
    },
    order: {
        type: Object, required: true
    },
    orderNumber: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model("Order", orderSchema)

// {
//     product: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     price: { type: Number, required: true }
// }