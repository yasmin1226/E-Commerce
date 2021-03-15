const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../utiles/appError");
const Product = require("./../models/productModel");
const APIFeatures = require("./../utiles/APIFeatures");
const catchAsync = require("./../utiles/catchAsync");
//const AppError = require("./../utiles/appError");

//uploading files
// const multiFillter = (req, file.cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an image please upload only imagees", 400), false);
//   }
// };
// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multiFillter,
// });

//exports.uploadProductImages = upload.fields([
//{ name: "imageCover", maxCount: 1 },
//{ name: "images", maxCount: 3 },
//]);
//upload.array('images',5);
exports.aliasTopProducts = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";

  req.query.fields = "name,price,ratingsAverage,description";
  next();
};

//route handelar
//get one product
exports.getOneProduct = catchAsync(async (req, res, next) => {
  // Product.findOne({_id:req.params.id})

  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("no product found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: { product },
  });
});

//geconstt all product
exports.getAllProducts = catchAsync(async (req, res, next) => {
  //execute the query

  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const products = await features.query;
  //send response
  res.status(200).json({
    status: "sucscess",
    results: products.length,
    data: { products: products },
  });
});

//add product
exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
  // try {
  // } catch (err) {
  //   res.status(400).json({
  //     status: "fail",
  //     message: "invalid data send",
  //   });
  // }
});

//update product
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new AppError("no product found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

//delete product
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndRemove(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
  if (!product) {
    return next(new AppError("no product found with that id", 404));
  }
});
exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$mainCatogrie" },
        numProducts: { $sum: 1 },
        numRating: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
