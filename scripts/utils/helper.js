const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const bcryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const comparePassword = async (candidatePassword, password) => {
  const isMatch = await bcrypt.compare(candidatePassword, password);
  return isMatch;
};

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username, isAdmin: user.isAdmin },
    process.env.JWT_REFRESH_SECRET
  );
};

module.exports = {
  bcryptPassword,
  comparePassword,
  generateRefreshToken,
  generateToken,
};
