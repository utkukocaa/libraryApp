const Book = require("../models/Book");

const list = () => {
  return Book.find();
};

const create = (data) => {
  return Book.create(data);
};

const findOne = (data) => {
  return Book.findOne(data);
};

const updateOne = (where, data) => {
  return Book.findOneAndUpdate(where, data, { new: true });
};

module.exports = { create, findOne, updateOne, list };
