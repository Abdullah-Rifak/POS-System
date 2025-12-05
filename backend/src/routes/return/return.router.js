const express = require("express");
const { httpAddReturn, httpGetAllReturns } = require("./return.controller");

const returnrouter = express.Router();

returnrouter.post("/create", httpAddReturn);
returnrouter.get("/", httpGetAllReturns);

module.exports = returnrouter;
