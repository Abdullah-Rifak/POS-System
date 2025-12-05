const express = require("express");

const {
  httpCreateBorrow,
  httpGetAllBorrowals,
  httpDeleteBorrowal,
  httpUpdateBorrowal,
  httpToggleBorrowerPaymentStatus,
} = require("./borrow.controller");
const { protect, roleCheck } = require("../authMiddleware/authMiddleware");

const BorrowRouter = express.Router();
BorrowRouter.post(
  "/create",
  protect,
  roleCheck(["Salesman"]),
  httpCreateBorrow
);
BorrowRouter.get("/", httpGetAllBorrowals);
BorrowRouter.delete("/delete/:id", httpDeleteBorrowal);
BorrowRouter.put("/update/:id", httpUpdateBorrowal);
BorrowRouter.patch("/:id/toggle", httpToggleBorrowerPaymentStatus);
module.exports = BorrowRouter;
