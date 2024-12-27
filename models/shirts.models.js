const mongoose = require("mongoose");
const shirtsSchema = new mongoose.Schema({
  shirtBrand: String,
  shirtName: String,
  ratings: Number,
  shirtColor: String,
  shirtSize: Number,
  shirtPrice: Number,
  shirtImage: String
});

const Shirts = mongoose.model("Shirts", shirtsSchema);
module.exports = Shirts;