const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  
})




// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema({
//   user: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User",
//     required: true 
//   },
//   items: [
//     {
//       product: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: "Shirts", required: true },
//       quantity: {
//         type: Number, 
//         default: 1 
//       },
//     },
//   ],
// });

// const Cart = mongoose.model("Cart", cartSchema);
// module.exports = Cart;
