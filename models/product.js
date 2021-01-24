const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    brand: {
        type: String
    },
    model: {
        type: String
    },
    price: {
        new: {
            type: Number
        },
        old: {
            type: Number
        }
    },
    description: {
        type: String
    },
    onSale: {
        type: Boolean
    },
    category: {
        type: Schema.Types.ObjectId, ref: "Category"
    }
})

module.exports = mongoose.model("Product", productSchema);;