const express = require("express");

const { httpAddReturnedItems } = require("./balance.controller");
const BalanceRouter = express.Router();

BalanceRouter.post("/create", httpAddReturnedItems);
module.exports = BalanceRouter;
