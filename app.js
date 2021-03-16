const express = require("express");
const morgan = require("morgan");
const AppError = require("./utiles/appError");
const globalHandeler = require("./controllers/errorController");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();

//middleware
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(c); //error
  //console.log(req.headers);
  next();
});
if (process.env.NODE_ENV === "environment") {
  app.use(morgan("dev"));
}

//routes

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.get("/", (req, res) => {
  console.log("heruko!");
});
///jandle every url that doen,t handle it
//must be the last one
app.all("*", (req, res, next) => {
  // const err = new Error(`can't find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;

  next(new AppError(`can't find ${req.originalUrl} on this server`, 404)); //will skip all middlewares
});
//error handling middleware
app.use(globalHandeler);
module.exports = app;
