const express = require("express");
const { httpLoginUser, httpLogout } = require("./auth.controller");
const AuthRouter = express.Router();

AuthRouter.post("/login", httpLoginUser);
AuthRouter.post("/logout", httpLogout);
module.exports = AuthRouter;
