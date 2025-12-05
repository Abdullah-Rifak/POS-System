const express = require("express");
const { protect, roleCheck } = require("./authMiddleware");
const protectedRouter = express.Router();

protectedRouter.get("/admin", protect, roleCheck(["Admin"]), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});
protectedRouter.get("/sales", protect, roleCheck(["Salesman"]), (req, res) => {
  res.json({ message: "Welcome Salesman!" });
});

module.exports = protectedRouter;
