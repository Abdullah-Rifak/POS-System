const express = require("express");
const {
  httpCreateItem,
  httpGetAllItems,
  httpDeleteItem,
  httpUpdateItem,
} = require("./item.controller");

const ItemRouter = express.Router();
ItemRouter.post("/create", httpCreateItem);
ItemRouter.get("/", httpGetAllItems);
ItemRouter.delete("/delete/:id", httpDeleteItem);
ItemRouter.put("/update/:id", httpUpdateItem);
module.exports = ItemRouter;
