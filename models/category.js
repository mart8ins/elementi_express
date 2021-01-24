const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category: {
        type: String,
        required: [true, "category is required!"]
    }
    ,
    products: [
        { type: Schema.Types.ObjectId, ref: "Product" }
    ]
})

module.exports = mongoose.model("Category", categorySchema);