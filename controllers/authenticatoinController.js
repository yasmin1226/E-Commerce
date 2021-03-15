//const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utiles/catchAsync");
const bycrpt = require("bcryptjs");
const AppError = require("./../utiles/appError");
//const { token } = require("morgan");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);
  //  jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  res.status(201).json({
    status: "sucess",
    token,
    data: {
      user: newUser,
    },
  });
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
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  //1 get token & chek if its exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //console.log(token);
  if (!token) {
    return next(
      new AppError("you are not logged in ..please log in to get access", 401)
    );
  }

  //2 verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  //3check if user stil exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("the user belongs to this token does no exist"));
  }
  //4 chek if user change password ofter the token
  req.user = freshUser;
  next();
});
