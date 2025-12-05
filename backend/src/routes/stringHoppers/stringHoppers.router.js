const express = require("express");
const {
  httpCreateStringHoppers,
  httpGetAllStringHoppers,
  httpDeleteStringHoppers,
  httpUpdateStringHoppers,
} = require("./stringHoppers.controller");

const { roleCheck, protect } = require("../authMiddleware/authMiddleware");

const HopperRouter = express.Router();
HopperRouter.post(
  "/create",
  protect,
  roleCheck(["Salesman"]),
  httpCreateStringHoppers
);
HopperRouter.get("/", httpGetAllStringHoppers);
HopperRouter.delete("/delete/:id", httpDeleteStringHoppers);
HopperRouter.put("/update/:id", httpUpdateStringHoppers);
module.exports = HopperRouter;
