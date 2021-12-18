const { StatusCodes } = require("http-status-codes");
const { create, findOne, updateOne, list } = require("../services/book");
const userService = require("../services/user");

const listBooks = async (req, res) => {
  try {
    const books = await list();
    res.status(StatusCodes.OK).json({ books });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title } = req.body;
    const isExist = await findOne({ title });
    if (isExist) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "The book is existed" });
    }
    const book = await create(req.body);
    res.status(StatusCodes.CREATED).json({ book });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await findOne({ _id: bookId });
    if (!book) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Book not found!" });
    }
    if (book.status.isBorrowed) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "The book is already borrowed" });
    }

    const now_date = new Date();
    const return_date = now_date.setDate(now_date.getDate() + 30);

    const status = {
      isBorrowed: true,
      borrowed_by: req.user.userId,
      borrowed_at: new Date(),
    };

    const user = await userService.findOne({ _id: req.user.userId });

    user.bookHistory.push({
      book_id: bookId,
      borrowed_at: new Date(),
    });

    user.currentBooks.push({
      book_id: bookId,
      borrowed_at: new Date(),
      return_date_until: return_date,
    });

    const updatedBook = await updateOne({ _id: bookId }, { status });

    const updatedUser = await userService.updateOne(
      { _id: req.user.userId },
      {
        bookHistory: user.bookHistory,
        currentBooks: user.currentBooks,
      }
    );

    res.status(StatusCodes.OK).json({ updatedBook, updatedUser });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await findOne({ _id: bookId });
    if (!book) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Book not found!" });
    }

    if (book.status.borrowed_by != req.user.userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "You have not borrowed this book" });
    }

    const status = {
      isBorrowed: false,
      borrowed_by: null,
      borrowed_at: null,
    };

    if (req.body.point) {
      book.bookPoints.push(req.body.point);
    }

    const updatedBook = await updateOne(
      { _id: bookId },
      { status, bookPoints: book.bookPoints }
    );
    const user = await userService.findOne({ _id: req.user.userId });

    const currentBooks = user.currentBooks.filter((i) => i.book_id != bookId);

    const updatedUser = await userService.updateOne(
      { _id: req.user.userId },
      { currentBooks }
    );

    res.status(StatusCodes.OK).json({
      updatedBook,
      updatedUser,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

module.exports = {
  createBook,
  borrowBook,
  listBooks,
  returnBook,
};
