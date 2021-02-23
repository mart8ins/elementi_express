const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    price: {
        new: {
            type: Number,
            min: 0,
            required: true
        },
        old: {
            type: Number,
            min: 0
        }
    },
    description: {
        type: String,
        required: true
    },
    onSale: {
        type: Boolean
    },
    category: {
        type: Schema.Types.ObjectId, ref: "Category"
    },
    active: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model("Product", productSchema);;