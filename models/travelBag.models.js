const mongoose = require("mongoose");

const TravelBagSchema = new mongoose.Schema({
    bagbrand: String,
    bagType: String,
    bagRatings: Number,
  bagPrice: Number,
  discountedPrice: Number,
  bagSize: String,
  returnPolicy: String,
  bagDescription: String,
  bagImage: String
});

const TravelBag = mongoose.model("TravelBag", TravelBagSchema);
module.exports = TravelBag;
