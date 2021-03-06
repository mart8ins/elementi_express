const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderStatusSchema = new Schema({
    status: {
        type: String
    },
    changeDate: {
        type: String
    },
    _id: false
})

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    shipping: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true }
    },
    date: {
        type: String,
    },
    order: {
        type: Object, required: true
    },
    statusHistory: [orderStatusSchema],
    currentStatus: {
        type: String,
        enum: ["Pending", "Processing", "Awaiting payment", "Shipped", "Completed", "Canceled"]
    },
    orderNumber: {
        type: String,
        required: true
    },
    comment: {
        type: String
    }

})

module.exports = mongoose.model("Order", orderSchema)

// {
//     product: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     price: { type: Number, required: true }
// }