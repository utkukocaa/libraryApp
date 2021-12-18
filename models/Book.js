const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    created_by: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    bookPoints: Array,
    status: {
      isBorrowed: {
        type: Boolean,
        default: false,
      },
      borrowed_by: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        default: null,
      },
      borrowed_at: {
        type: Date,
        default: null,
      },
    },
  },

  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Book", BookSchema);
