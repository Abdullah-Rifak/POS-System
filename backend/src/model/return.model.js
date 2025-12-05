const returnedItems = require("./return.mongo");
const Items = require("./item.mongo");
const Supplier = require("./supplier.mongo");
const Stock = require("./stock.mongo");
// const { recalcSupplierPayment } = require("./supplier.model");

const addReturnedItems = async (itemId, returnItem) => {
  try {
    const returnEntry = new returnedItems({
      itemId,
      returnItem,
    });

    await returnEntry.save();

    const item = await Items.findById(itemId);
    if (!item) return { returnEntry };

    return { item, returnEntry };
  } catch (err) {
    console.error("Error in addReturnedItems:", err.message);
    throw err;
  }
};

const getAllReturns = async () => {
  return await returnedItems.find().populate("itemId");
};
module.exports = {
  addReturnedItems,
  getAllReturns,
};
