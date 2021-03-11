const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./../../models/productModel");
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//connect to moongoose DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    //  console.log(con.connections);
    console.log("db connect success");
  });

//read file
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, "utf-8")
);
///import
const importData = async () => {
  try {
    Product.create(products);
    console.log("data imported successfuly");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//deltelt
const deleteData = async () => {
  try {
    Product.deleteMany();
    console.log("data delteed successfuly");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
//console.log("before");
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
console.log(process.argv);
