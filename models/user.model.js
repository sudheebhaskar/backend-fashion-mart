const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  userId: String,
  email: String,
  mobileNumber: Number,
  address: String,
  pincode: Number
});

const User = mongoose.model("User", userSchema);
module.exports = User;
