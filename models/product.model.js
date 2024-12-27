const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  productId: String,
  productPrice: Number,
  productRating: Number,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product