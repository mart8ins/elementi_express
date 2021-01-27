const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("../models/product");

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

// mongoose midlleware - when category is deleted then also are deleted all asiociated products with this category
categorySchema.post("findOneAndDelete", async function (category) {
    if (category.products.length) {
        await Product.deleteMany({ _id: { $in: category.products } })
    }
    console.log("CATEGORY WITH ALL ASOCIATED PRODUCTS DELETED!!!")
})


module.exports = mongoose.model("Category", categorySchema);