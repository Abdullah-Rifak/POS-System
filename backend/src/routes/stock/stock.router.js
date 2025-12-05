const express = require("express");

const {
  httpAddSuppliedStock,
  httpGetAllStock,
  httpGetAllcombinedsstock,
  httpDeleteStock,
  httpUpdateCombined,
  httpUpdateStock,
} = require("./stock.controller");

const StockRouter = express.Router();

StockRouter.post("/create", httpAddSuppliedStock);
StockRouter.get("/", httpGetAllStock);
StockRouter.get("/combined", httpGetAllcombinedsstock);
StockRouter.delete("/delete/:id", httpDeleteStock);
StockRouter.put("/update/:id", httpUpdateCombined);
StockRouter.put("/updateStock/:id", httpUpdateStock);
module.exports = StockRouter;
