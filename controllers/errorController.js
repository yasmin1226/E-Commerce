const AppError = require("./../utiles/appError");
const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}...`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  console.log("errmsg", err.errmsg);
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  //nsole.log("errmsg", value);

  const message = `Duplicate field value: ${value} please use another value...`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  console.log("errors", errors);
  const message = `invalid input data ${errors.join(". ")}`;

  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    //    name: err.name,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  //operatinal ,trusted error sent to client

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //programing or unknown error
  } else {
    console.error("Error", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};
module.exports = (err, req, res, next) => {
  //console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    //  console.log("is develop");

    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    console.log("prod");
    // console.log(err.name);

    // let error = { ...err };
    let error = err;
    // console.log("erroee", error);

    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      //console.log("err", error);

      error = handleDuplicateFieldsDB(error);
    }
    if (err.name === "ValidationError") {
      // console.log("validation error");
      error = handleValidationErrorDB(error);
    }
    // console.log(err.name);
    // console.log("false");

    sendErrorProd(error, res);
  }
  // else {
  //   console.log("false");
  //   console.log(process.env.NODE_ENV);
  //   console.log(err.name);
  // }
  next();
};
