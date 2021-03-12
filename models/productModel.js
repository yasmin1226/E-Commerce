const mongoose = require("mongoose");
const slugify = require("slugify");
const productSchema = new mongoose.Schema({
  mainCatogrie: {
    type: String,
    required: [true, "a product must hava a main catogrie"],
    enum: ["shoes", "bags"],
  },
  name: {
    type: String,

    unique: true,
    required: [true, "a product must hava a name"],
  },
  slug: String,
  colors: [String],
  quantity: {
    type: Number,
    required: [true, "a product must have its quntity"],
  },
  ratingsAverage: { type: Number, default: 4.5, max: 5 },
  price: { type: Number, required: [true, "product must have price"] },
  ratingsQuantity: { type: Number, default: 0 },
  priceDiscount: { type: Number },
  description: {
    type: String,
    trim: true,
    required: [true, "a product must have a description"],
  },
  imageCover: {
    type: String,
    required: [true, "a product must have a cover image "],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});
//Document middle ware :runs befroe .save and .create
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
