const { StatusCodes } = require("http-status-codes");

const validateMiddleware = (schema, source) => (req, res, next) => {
  //! req.body, req.params, req.query

  const { value, error } = schema.validate(req[source]);

  if (error) {
    const errorMessage = error?.details
      ?.map((detail) => detail?.message)
      .join(", ");
    //   ["message1", "message2", "m3"] => "message1, message2, m3"
    return res.status(StatusCodes.BAD_REQUEST).send({ error: errorMessage });
  }
  Object.assign(req, value);
  next();
};

module.exports = validateMiddleware;
