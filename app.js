const express = require("express");
const morgan = require("morgan");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();

//middleware
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log("hello from middle ware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
if (process.env.NODE_ENV === "environment") {
  app.use(morgan("dev"));
}

//routes

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
module.exports = app;
