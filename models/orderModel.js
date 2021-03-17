const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "ordering must belongs to a Product"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "ordering must belongs to a User"],
  },
  // price: {
  //   type: Number,
  //   required: [true, "booking must have a price"],
  // },
  status: {
    type: String,
    enum: ["pending", "rejicted", "accepted"],
    default: "pending",
  },
  quantity: {
    type: Number,
  },
  createdAt: {
    type: Date,
    defult: Date.now(),
  },
  totalPrice: { type: Number },
});
orderSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "product",
    select: "name",
  });
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
