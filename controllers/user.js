const { StatusCodes } = require("http-status-codes");
const {
  bcryptPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");
const { create, findOne, list } = require("../services/user");

const listUsers = async (req, res) => {
  try {
    const users = await list();
    res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    let { email } = req.body;
    const isExist = await findOne({ email });
    if (isExist) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "The email is existed" });
    }
    req.body.password = await bcryptPassword(req.body.password);
    const user = await create(req.body);
    let { password, ...rest } = user._doc;
    res.status(StatusCodes.CREATED).json({ user: rest });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    let user = await findOne({ email: req.body.email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found!" });
    }
    const isMatch = comparePassword(req.body.password, user.password);
    if (!isMatch) {
      res.status(StatusCodes.BAD_REQUEST).json({ msg: "Password is wrong" });
    }

    delete user._doc.password;

    user = {
      ...user._doc,
      tokens: {
        access_token: generateToken(user),
        refresh_token: generateRefreshToken(user),
      },
    };
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await updateOne({ _id: req.user.userId }, req.body);
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

const removeUser = async (req, res) => {
  try {
    const user = await deleteOne({ _id: req.user.userId });
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  removeUser,
  listUsers,
};
