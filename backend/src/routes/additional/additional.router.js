const express = require("express");

const {
  httpCreateAdditional,
  httpDeleteAdditional,
  httpGetAllAdditionals,
} = require("./additional.controller");
const { protect, roleCheck } = require("../authMiddleware/authMiddleware");
const AdditionalRouter = express.Router();

AdditionalRouter.post(
  "/create",
  protect,
  roleCheck(["Salesman"]),
  httpCreateAdditional
);
AdditionalRouter.get("/", httpGetAllAdditionals);
AdditionalRouter.delete("/delete/:id", httpDeleteAdditional);
module.exports = AdditionalRouter;
