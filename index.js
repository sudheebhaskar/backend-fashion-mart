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

//const jsonData = fs.readFileSync("products.json", "utf-8");
//const productsData = JSON.parse(jsonData);

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on PORT", PORT);
});