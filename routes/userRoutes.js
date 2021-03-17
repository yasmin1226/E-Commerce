const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");
const authenticatoinController = require("./../controllers/authenticatoinController");

router.post("/signup", authenticatoinController.signup);
router.post("/login", authenticatoinController.login);
router.get("/logout", authenticatoinController.logout);

router.use(authenticatoinController.protect);
//router.use(authenticatoinController.restrictTo("admin"));
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router
  .route("/")
  .get(
    //  authenticatoinController.protect,
    //authenticatoinController.restrictTo("admin"),
    userController.getAllUsers
  )
  .post(
    //authenticatoinController.protect,
    //authenticatoinController.restrictTo("admin"),
    userController.createUser
  );
router
  .route("/:id")
  .get(
    // authenticatoinController.protect,
    // authenticatoinController.restrictTo("admin"),
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.getOneUser
  )
  .patch(userController.updateUser)
  .delete(
    // authenticatoinController.protect,
    //authenticatoinController.restrictTo("admin"),
    userController.deleteUser
  );
module.exports = router;
