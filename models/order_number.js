const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderNumber = new Schema({
    orderNumber:
    {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Order_Number", orderNumber);