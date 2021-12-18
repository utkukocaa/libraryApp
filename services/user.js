const User = require("../models/User");

const list = () => {
  return User.find();
};

const create = (data) => {
  return User.create(data);
};

const findOne = (data) => {
  return User.findOne(data);
};

const updateOne = (where, data) => {
  return User.findOneAndUpdate(where, data, { new: true });
};
const deleteOne = (id) => {
  return User.findByIdAndRemove(id);
};

module.exports = {
  create,
  findOne,
  updateOne,
  deleteOne,
  list,
};
