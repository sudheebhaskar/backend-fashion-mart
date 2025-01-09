const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productBrandName: String,
  productName: String,
  productUserGender: [
    {
      type: String,
      enum: [
        "Men",
        "Women"
      ],
    },
  ],
  productCategory: String,
  productPrice: Number,
  productRating: Number,
  productSize: [
    {
      type: String,
      enum: [
        "s",
        "M",
        "L",
        "38",
        "40",
        "42",
        "44",
        "46",
        "Onesize"
        ],
    },
  ],
  productImage: String,
  productDescription: String,
  productDiscountedPrice: Number,
  productReturnPolicy: String
});

const Products = mongoose.model("Products", productSchema);
module.exports = Products