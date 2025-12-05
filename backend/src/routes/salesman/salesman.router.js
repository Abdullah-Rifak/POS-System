const express = require("express");
const {
  httpGetAllSalesmen,
  httpCreateSalesman,
  httpDeleteSalesman,
  httpUpdateSalesman,
} = require("./salesman.controller");

const salesmanrouter = express.Router();

salesmanrouter.get("/", httpGetAllSalesmen);
salesmanrouter.post("/create", httpCreateSalesman);
salesmanrouter.put("/update/:id", httpUpdateSalesman);
salesmanrouter.delete("/delete/:id", httpDeleteSalesman);
module.exports = salesmanrouter;
