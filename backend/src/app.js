const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const salesmanRouter = require("./routes/salesman/salesman.router");
const supplierRouter = require("./routes/supplier/supplier.router");
const itemRouter = require("./routes/item/item.router");
//const adminRouter = require("./routes/admin/admin.router");
const stockRouter = require("./routes/stock/stock.router");
const returnRouter = require("./routes/return/return.router");
const borrowRouter = require("./routes/borrow/borrow.router");
const authRouter = require("./routes/auth/auth.router");
const protectedRouter = require("./routes/authMiddleware/protectedRoutes.router");
const additionalRouter = require("./routes/additional/additional.router");
const hopperRouter = require("./routes/stringHoppers/stringHoppers.router");
//const balanceRouter = require("./routes/balance/balance.router");
const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//middleware
app.use("/salesman", salesmanRouter);
app.use("/supplier", supplierRouter);
app.use("/item", itemRouter);
app.use("/stock", stockRouter);
app.use("/return", returnRouter);
app.use("/borrow", borrowRouter);
app.use("/auth", authRouter);
app.use("/protected", protectedRouter);
app.use("/additional", additionalRouter);
app.use("/hoppers", hopperRouter);
// app.use("/admin", adminRouter);
app.get("/health", (req, res) => res.json({ ok: true }));

module.exports = app;
