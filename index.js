const express = require("express")
const app = express()

const { initializeDatabase } = require("./db/db.connect");
const fs = require("fs");

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));


const Product = require("./models/products.model.js")
app.use(express.json())
initializeDatabase();

// const jsonData = fs.readFileSync("products.json", "utf-8");
// const productsData = JSON.parse(jsonData);

// async function seedData(){
//   try{
//     for(const productData of productsData){
//       const existingProduct = await Product.findOne({ 
//         productName: productData.productName,
//         productBrandName: productData.productBrandName 
//       });
      
//       if(!existingProduct) {
//         const newProduct = new Product({
//           productBrandName: productData.productBrandName,
//           productName: productData.productName,
//           productCategory: productData.productCategory,
//           productPrice: productData.productPrice,
//           productUserGender: productData.productUserGender,
//           productRating: productData.productRating,
//           productSize: productData.productSize,
//           productImage: productData.productImage,
//           productDescription: productData.productDescription,
//           productDiscountedPrice: productData.productDiscountedPrice,
//           productReturnPolicy: productData.productReturnPolicy
//         });
//         await newProduct.save();
//       }
//     }
//     console.log("Data seeding completed");
//   } catch (error){
//     console.log("Error seeding the data", error);
//   }
// }

//seedData();


async function readAllProducts(){
  try{
    const allProducts = await Product.find()
    return allProducts
  } catch(error){
    console.log(error)
  }
}


app.get("/products", async(req, res) => {
  try{
    const products = await readAllProducts()
    if(products.length != 0){
      res.json(products)
    } else{
      res.status(404).json({error: "No product found"})
    }
  } catch(error){
    res.status(500).json({error: "Failed to fetch products."})
  }
})


const Cart = require("./models/cart.model.js");

// Get cartpage for a user
app.get("/cartpage/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.product');
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Add item to cartpage
app.post("/cartpage/add", async (req, res) => {
  try {
    const { userId, productId, quantity, size } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, size });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// Update cartpage item quantity
app.put("/cartpage/update", async (req, res) => {
  try {
    const { userId, productId, quantity, size } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.items.find(
      item => item.product.toString() === productId && item.size === size
    );

    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    item.quantity = quantity;

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        item => !(item.product.toString() === productId && item.size === size)
      );
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// Remove item from cartpage
app.delete("/cartpage/remove", async (req, res) => {
  try {
    const { userId, productId, size } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => !(item.product.toString() === productId && item.size === size)
    );

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});


const Wishlist = require("./models/wishlist.model.js");

// Get wishlist
app.get("/wishlist/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate('products');
    if (!wishlist) {
      return res.json({ products: [] });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// Add to wishlist
app.post("/wishlist/add", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
    res.json(populatedWishlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

// Remove from wishlist
app.delete("/wishlist/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      product => product.toString() !== productId
    );

    await wishlist.save();
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
    res.json(populatedWishlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on PORT", PORT);
});