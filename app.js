const express = require("express");
const morgan = require("morgan");
const comperaion = require("compression");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
var hpp = require("hpp");

const AppError = require("./utiles/appError");
const globalHandeler = require("./controllers/errorController");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();

app.use(helmet());

//middleware
if (process.env.NODE_ENV === "environment") {
  app.use(morgan("dev"));
}
app.use(cookieParser());
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());

//
// app.use(
//   hpp({
//     whitelist: [""],
//   })
// );
app.use(express.static(`${__dirname}/public`));
app.use(comperaion());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(c); //error
  //console.log(req.headers);
  next();
});

//routes

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.get("/", (req, res) => {
  res.send("heruko!");
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
