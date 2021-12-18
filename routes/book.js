const express = require("express");
const validate = require("../middlewares/validate");
const bookController = require("../controllers/book");
const { createBook, returnedBook } = require("../validations/book");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/adminAuth");

const router = express.Router();

router.route("/list").get(bookController.listBooks);
router
  .route("/create")
  .post(authAdmin, validate(createBook, "body"), bookController.createBook);
router.route("/borrow-book/:bookId").get(auth, bookController.borrowBook);
router
  .route("/return-book/:bookId")
  .post(auth, validate(returnedBook, "body"), bookController.returnBook);

module.exports = router;
