const express = require("express");
const router = express.Router();
const userRouter = require("./../controllers/userController");

router.route("/").get(userRouter.getAllUsers).post(userRouter.createUser);
router
  .route("/:id")
  .get(userRouter.getOneUser)
  .patch(userRouter.updateUser)
  .delete(userRouter.deleteUser);
module.exports = router;
