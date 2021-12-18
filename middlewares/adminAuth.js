const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const authAdmin = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "You need to login" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.isAdmin) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You are not admin yo do this process" });
    }

    req.user = { userId: payload.userId, username: payload.username };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: "You need to login you're not authenticated" });
  }
};

module.exports = authAdmin;
