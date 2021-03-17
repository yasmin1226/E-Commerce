const { promisify } = require("util");

const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utiles/catchAsync");
const bycrpt = require("bcryptjs");
const AppError = require("./../utiles/appError");

//const { read } = require("fs");
//const { token } = require("morgan");
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const expires = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  );
  //const httpOnly = true;
  //let secure = false;

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production")
    //cookieOptions.secure = true; // cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
  //console.log("cookie", res.cookie("jwt", token, cookieOptions));
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  // console.log("req.cookies", req.cookies);
  // const newUser = await User.create(req.body);

  const newUser = await User.create(
    //  {
    req.body
    // role: req.body.role,
    // name: req.body.name,
    // email: req.body.email,
    // password: req.body.password,
    // passwordConfirm: req.body.passwordConfirm,
    // }
  );
  createSendToken(newUser, 201, res);
  // const token = signToken(newUser._id);
  // //  jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  // //   expiresIn: process.env.JWT_EXPIRES_IN,
  // // });
  // res.status(201).json({
  //   status: "sucess",
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email & pass exist
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }

  //2 if user exist && password is correct
  const user = await User.findOne({ email: email }).select("+password");
  //console.log(user);
  //const correct =await  user.correctPassword("password,user.password");//if user doesn't exist error
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401)); //unauthorized
  }
  ///3 send token if ok
  createSendToken(user, 201, res);

  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
});
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookie.jwt,
        process.env_JWT_SECRET
      );
      const currentUser = await user.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      //   res.locals.user = currentUser;
      res.user = currentUser;

      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};
exports.protect = catchAsync(async (req, res, next) => {
  //1 get token & chek if its exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  //console.log(token);
  if (!token) {
    return next(
      new AppError("you are not logged in ..please log in to get access", 401)
    );
  }

  //2 verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  // //3check if user stil exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("the user belongs to this token does no exist"));
  }
  // //4 chek if user change password ofter the token
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you dont have permission to perform this actiion ", 403)
      );
    }
    next();
  };
};

// exports.updatePassword = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.user.id).select("+password");
//   if (!(await user.correctPassword(req.body.passwordConfirm, user.password))) {
//     return next(new AppError("your current password is wrong", 401));
//   }

//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   await user.save();
//   const token = signToken(user._id);
//   read.status(200).json({
//     status: "success",
//     token,
//   });
// });
