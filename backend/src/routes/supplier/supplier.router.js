const express = require("express");
const {
  httpCreateSupplier,
  httpDeleteSupplier,
  httpUpdateSupplier,
  httpGetAllSuppliers,
  httpGetSuppliersWithPayment,
  httpToggleSupplierPaymentStatus,
} = require("./supplier.controller");
const supplierMongo = require("../../model/supplier.mongo");

const SupplierRouter = express.Router();
SupplierRouter.post("/create", httpCreateSupplier);
SupplierRouter.delete("/delete/:id", httpDeleteSupplier);
SupplierRouter.put("/update/:id", httpUpdateSupplier);
SupplierRouter.get("/get", httpGetSuppliersWithPayment);
SupplierRouter.get("/", httpGetAllSuppliers);
SupplierRouter.patch("/:id/toggle", httpToggleSupplierPaymentStatus);
module.exports = SupplierRouter;
