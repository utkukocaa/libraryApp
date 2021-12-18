const express = require("express");
const validate = require("../middlewares/validate");
const userController = require("../controllers/user");
const {
  createUserVal,
  loginUserVal,
  updateUserVal,
} = require("../validations/user");
const auth = require("../middlewares/auth");

const router = express.Router();

router.route("/list").get(userController.listUsers);
router
  .route("/create")
  .post(validate(createUserVal, "body"), userController.createUser);
router
  .route("/login")
  .post(validate(loginUserVal, "body"), userController.loginUser);
router
  .route("/update")
  .post(auth, validate(updateUserVal, "body"), userController.updateUser);
router.route("/delete").post(auth, userController.removeUser);

module.exports = router;
