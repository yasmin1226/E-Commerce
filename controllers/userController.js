const User = require("./../models/userModel");
const catchAsync = require("./../utiles/catchAsync");
const APIFeatures = require("./../utiles/APIFeatures");
const AppError = require("./../utiles/appError");
exports.getOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("no user found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user },
  });
});
exports.getAllUsers = catchAsync(async (req, res, next) => {
  // const users = await User.find();
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;
  //send response

  res.status(200).json({
    status: "sucscess",
    results: users.length,
    data: { users: users },
  });
});
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("no user found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndRemove(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
  if (!user) {
    return next(new AppError("no user found with that id", 404));
  }
});
