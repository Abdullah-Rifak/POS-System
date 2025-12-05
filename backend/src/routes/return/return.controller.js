const { getAllReturns, addReturnedItems } = require("../../model/return.model");
const { updateSupplierTotalPayment } = require("../../model/supplier.model");
const Item = require("../../model/item.mongo");
const httpAddReturn = async (req, res) => {
  try {
    const { itemId, returnItem } = req.body;

    const newReturn = await addReturnedItems(itemId, returnItem);

    return res.status(201).json(newReturn);
  } catch (error) {
    console.error("Error adding return in controller:", error.message);
    return res.status(500).json({ message: "Error adding return" });
  }
};
const httpGetAllReturns = async (req, res) => {
  try {
    const returns = await getAllReturns();
    res.status(200).json(returns);
  } catch (error) {
    console.error("Error fetching returns:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching returns", error: error.message });
  }
};
module.exports = {
  httpAddReturn,
  httpGetAllReturns,
};
