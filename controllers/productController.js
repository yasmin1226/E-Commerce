const Product = require("./../models/productModel");
const APIFeatures = require("./../utiles/APIFeatures");

exports.aliasTopProducts = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,description";
  next();
};

//route handelar
//get one product
exports.getOneProduct = async (req, res) => {
  try {
    // Product.findOne({_id:req.params.id})
    const product = await Product.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//geconstt all product
exports.getAllProducts = async (req, res) => {
  try {
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
  } catch (err) {
    {
      console.log(err);
      res.status(404).json({
        status: "fail",
        message: err,
      });
    }
  }
};

//add product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "invalid data send",
    });
  }
};

//update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//delete product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getProductStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
