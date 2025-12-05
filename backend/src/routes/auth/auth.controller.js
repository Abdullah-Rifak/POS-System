const { loginService, logoutService } = require("../../model/authService");

const httpLoginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const result = await loginService(userName, password);

    res.status(200).json({
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const httpLogout = async (req, res) => {
  try {
    await logoutService();
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
module.exports = { httpLoginUser, httpLogout };
