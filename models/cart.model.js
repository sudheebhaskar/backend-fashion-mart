const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    productBrandName: String,
    productName: String,
    productImage: String,
    productPrice: Number,
    productSize: String,
    productQuantity: {
        type: Number,
        default: 1
    },
    totalPrice: Number

})

const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart