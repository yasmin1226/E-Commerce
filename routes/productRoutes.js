const express = require("express");
const router = express.Router();
const authenticatoinController = require("./../controllers/authenticatoinController");

//max
//const multer = require("multer");
///const upload = multer({ dest: "public/img/products" });
//..
const productController = require("./../controllers/productController");
const userController = require("./../controllers/userController");

router
  .route("/top-5-cheap")
  .get(productController.aliasTopProducts, productController.getAllProducts);

router.route("/product-stats").get(productController.getProductStats);

router
  .route("/")
  .get(authenticatoinController.protect, productController.getAllProducts)
  //max
  //upload.single("productImage")
  //..
  .post(
    /*upload.single("productImage"),*/ productController.uploadProductImage,
    productController.resizeProductImage,
    productController.createProduct
  );

router.route("/:name").get(productController.searchProductWithName);
router
  .route("/:id")
  .get(productController.getOneProduct)
  .patch(
    authenticatoinController.protect,
    // authenticatoinController.restrictTo("admin"),
    productController.uploadProductImage,
    productController.resizeProductImage,
    productController.updateProduct
  )
  .delete(
    authenticatoinController.protect,
    authenticatoinController.restrictTo("admin"),
    productController.deleteProduct
  );
module.exports = router;
