const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
    bookHistory: [
      {
        book_id: {
          type: mongoose.Types.ObjectId,
          ref: "book",
        },
        borrowed_at: Date,
      },
    ],
    currentBooks: [
      {
        book_id: {
          type: mongoose.Types.ObjectId,
          ref: "book",
        },
        borrowed_at: Date,
        return_date_until: Date,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", UserSchema);
