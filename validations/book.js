const Joi = require("joi");

const createBook = Joi.object({
  title: Joi.string().required().min(2),
  author: Joi.string().required().min(2),
});

const returnedBook = Joi.object({
  point: Joi.string().min(1).max(5),
});

module.exports = { createBook, returnedBook };
