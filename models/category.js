const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("../models/product");
const cloudinary = require('cloudinary').v2;

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
        // to delete images form cloudinary for every product what was deleted during category deletion
        for (let productId of category.products) {
            let product = await Product.findById(productId);
            if (product) {
                cloudinary.uploader.destroy(product.image.fileName);
            }
        }
        // delete all products form db
        await Product.deleteMany({ _id: { $in: category.products } });
    }
    console.log("CATEGORY WITH ALL ASOCIATED PRODUCTS DELETED!!!")
})


module.exports = mongoose.model("Category", categorySchema);