const User = require("./user.mongo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const loginService = async (userName, password) => {
  const user = await User.findOne({ userName });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });

  return {
    token,
    user: {
      id: user._id,
      userName: user.userName,
      role: user.role,
    },
  };
};
const logoutService = async () => {
  return { message: "Logged out successfully" };
};
module.exports = { loginService, logoutService };
