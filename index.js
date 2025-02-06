const express = require("express")
const app = express()

const { initializeDatabase } = require("./db/db.connect");
const fs = require("fs");

// const cors = require("cors");
// const corsOptions = {
//   origin: "*",
//   credentials: true,
//   optionSuccessStatus: 200,
// };

// app.use(cors(corsOptions));

const cors = require("cors");
const corsOptions = {
  origin: ["https://frontend-fashion-mart.vercel.app", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const Product = require("./models/products.model.js")
app.use(express.json())
initializeDatabase();

const Cart = require("./models/cart.model.js");

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

app.post("/cart", async(req, res) => {
  try {
    const {productID, productBrandName, productName, productPrice, productImage, productSize } = req.body;
    
    const cartItem = new Cart({
      productID,
      productBrandName,
      productName,
      productPrice,
      productImage,
      productSize
    });

    await cartItem.save();
    res.status(201).json({ message: "Product added to cart successfully", cartItem });
  } catch(error) {
    res.status(500).json({ error: "Failed to add product to cart" });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on PORT", PORT);
});

