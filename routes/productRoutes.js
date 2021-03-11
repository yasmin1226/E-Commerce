const express = require("express");
const router = express.Router();

const productController = require("./../controllers/productController");
router
  .route("/top-5-cheap")
  .get(productController.aliasTopProducts, productController.getAllProducts);

router.route("/product-stats").get(productController.getProductStats);

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);
router
  .route("/:id")
  .get(productController.getOneProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);
module.exports = router;
