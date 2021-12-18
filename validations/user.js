const Joi = require("joi");

const createUserVal = Joi.object({
  username: Joi.string().required().min(2),
  email: Joi.string().email().required().min(8),
  password: Joi.string().required().min(8),
  isAdmin: Joi.boolean().default(false),
});
const loginUserVal = Joi.object({
  email: Joi.string().email().required().min(8),
  password: Joi.string().required().min(8),
});

const updateUserVal = Joi.object({
  username: Joi.string().min(2),
  password: Joi.string().min(8),
});
module.exports = { createUserVal, loginUserVal, updateUserVal };
