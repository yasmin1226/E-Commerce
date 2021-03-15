const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");
const authenticatoinController = require("./../controllers/authenticatoinController");

router.post("/signup", authenticatoinController.signup);
router.post("/login", authenticatoinController.login);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = router;
