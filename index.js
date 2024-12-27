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

const Shirt = require("./models/shirts.models.js")
app.use(express.json())
initializeDatabase();

const jsonData = fs.readFileSync("shirts.json", "utf-8");
const shirtsData = JSON.parse(jsonData);

function seedData(){
  try{
    for(const shirtData of shirtsData){
      const newShirt = new Shirt({
        shirtBrand: shirtData.shirtBrand,
        shirtName: shirtData.shirtName,
        ratings: shirtData.ratings,
        shirtColor: shirtData.shirtColor,
        shirtSize: shirtData.shirtSize,
        shirtPrice: shirtData.shirtPrice,
        shirtImage: shirtData.shirtImage
        
      });
      newShirt.save();
    }
  } catch (error){
      console.log("Error seeding the data", error);
  }
}

//seedData();


async function readAllShirts(){
  try{
    const allShirts = await Shirt.find()
    return allShirts
  } catch(error){
    console.log(error)
  }
}


app.get("/shirts", async(req, res) => {
  try{
    const shirts = await readAllShirts()
    if(shirts.length != 0){
      res.json(shirts)
    } else{
      res.status(404).json({error: "No shirt found"})
    }
  } catch(error){
    res.status(500).json({error: "Failed to fetch shirts."})
  }
})


const TravelBag = require("./models/travelBag.models.js")


const jsonDataBags = fs.readFileSync("travelBags.json", "utf-8");
const travelBagsData = JSON.parse(jsonDataBags);

function seedTravelBagsdata(){
   try{
      for(const travelBagData of travelBagsData){
        const newTravelBag = new TravelBag({
          bagBrand: travelBagData.bagBrand,
          bagType: travelBagData.bagType,
          bagRatings: travelBagData.bagRatings,
          bagPrice: travelBagData.bagPrice,
          discountedPrice: travelBagData.discountedPrice,
          bagSize: travelBagData.bagSize,
          returnPolicy: travelBagData.returnPolicy,
          bagDescription: travelBagData.bagDescription,
          bagImage: travelBagData.bagImage
 });
        newTravelBag.save();
      }
    } catch (error){
        console.log("Error seeding the data", error);
    }
  }

//seedTravelBagsdata();

async function readAllTravelBags(){
  try{
    const allBags = await TravelBag.find()
    return allBags
  } catch(error){
    console.log(error)
  }
}


app.get("/travelBags", async(req, res) => {
  try{
    const travelBags = await readAllTravelBags()
    if(travelBags.length != 0){
      res.json(travelBags)
    } else{
      res.status(404).json({error: "No bag found"})
    }
  } catch(error){
    res.status(500).json({error: "Failed to fetch travelbag."})
  }
})



const User = require("./models/user.model");
const userData = {
  name: "Paul" ,
    email:"paul@gmail.com" ,
    mobileNumber: "12345",
    address: "some address",
    pincode: 560078
}

const addUser = async () => {
  try{
    const newUser = new User(userData);
    await newUser.save();
     } catch(error){
      console.log("Error: ", error);  
  }
};

//addUser();
const Cart = require("./models/cart.model");


const cartData = {
  item: "Shirt",
  price: 1099,
  quantity: 1,
  totalsCost : 1099,
  user: "67523b23e0bb095dc4f725af"
  }

const addCart = async () => {
  try{
    const newCartItem = new User(userData);
    await newCartItem.save();
    console.log("Item added to cart successfully.");
  } catch(error){
      console.log("Error", error);
  }
}

//addCart();

app.post("/cart", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }
    await cart.save();

    res.status(201).json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
});



const Wishlist = require("./models/wishlist.model"); 

app.post("/wishlist", async (req, res) => {
  const { userId, productId } = req.body;
try {
    let wishlist = await Wishlist.findOne({ user: userId });
     if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    } else {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    await wishlist.save();

    res.status(201).json({ message: "Product added to wishlist successfully", wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add product to wishlist" });
  }
});

app.delete("/cart/:userId/item/:productId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Item removed successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on PORT", PORT);
});