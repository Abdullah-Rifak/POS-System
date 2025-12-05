const Stock = require("./stock.mongo");
const Items = require("./item.mongo");
const returnItems = require("./return.mongo");
const mongoose = require("mongoose");
// const { recalcSupplierPayment } = require("./supplier.model");

const addSuppliedStock = async (itemId, quantity) => {
  try {
    //check items availabilty
    const item = await Items.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    const stockEntry = new Stock({
      itemId,
      quantity,
    });
    await stockEntry.save();

    return { item, stockEntry };
  } catch (err) {
    console.error("Error in addSuppliedStock", err.message);
    throw err;
  }
};

const getStockByItem = async (itemId) => {
  return await Stock.findOne({ itemId }).populate("itemId");
};
const getAllStock = async () => {
  try {
    // Populate item details
    return await Stock.find().populate("itemId");
  } catch (err) {
    console.error("Error fetching stock:", err.message);
    throw err;
  }
};

const deleteStock = async (stockId) => {
  const stock = await Stock.findById(stockId);
  if (!stock) return null;

  const item = await Items.findById(stock.itemId);

  await returnItems.deleteMany({ itemId: stock.itemId });

  await Stock.findByIdAndDelete(stockId);

  return stock;
};
const updateCombinedStockAndReturn = async (id, { returnItem, quantity }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Return ID");
  }
  console.log(
    " [updateCombinedStockAndReturn] Searching returnItems for ID:",
    id
  );
  // Find the Return record
  const returnDoc = await returnItems.findById(id);
  if (!returnDoc) throw new Error("Return record not found");

  console.log(" [updateCombinedStockAndReturn] Found returnDoc:", returnDoc);

  // Update Return
  returnDoc.returnItem = returnItem;
  await returnDoc.save();

  // Update related Stock using itemId
  const stockDoc = await Stock.findOne({ itemId: returnDoc.itemId });
  if (!stockDoc) throw new Error("Stock record not found for item");

  stockDoc.quantity = quantity;
  await stockDoc.save();

  // Repopulate for UI response
  const updatedReturn = await returnItems.findById(id).populate("itemId");
  const updatedStock = await Stock.findOne({
    itemId: returnDoc.itemId,
  }).populate("itemId");

  return { updatedReturn, updatedStock };
};
const getAllStockWithReturns = async (date = new Date()) => {
  try {
    // Start and end of today
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const stocks = await Stock.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("itemId");

    const returns = await returnItems.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const combined = stocks
      .filter((stock) => stock.itemId)
      .map((stock) => {
        const quantity = Number(stock.quantity) || 0;
        const price = Number(stock.itemId.price) || 0;
        const cost = Number(stock.itemId.cost) || 0;

        // Find all returns linked to this item
        const relatedReturns = returns.filter(
          (ret) => ret.itemId?.toString() === stock.itemId._id.toString()
        );

        const totalReturned = relatedReturns.reduce(
          (sum, ret) => sum + (Number(ret.returnItem) || 0),
          0
        );

        // Calculate profit correctly
        const profit = (price - cost) * (quantity - totalReturned);

        // Return combined object
        return {
          _id: stock._id,
          itemId: stock.itemId._id,
          itemName: stock.itemId.itemName,
          cost,
          price,
          totalStock: quantity,
          totalReturned,
          availableQuantity: quantity - totalReturned,
          profit,
          returnId: relatedReturns[0]?._id || null,
        };
      });

    return combined;
  } catch (error) {
    console.error("Error in getAllStockWithReturns:", error.message);
    throw error;
  }
};
const updateStock = async (data) => {
  if (!data.id) {
    throw new Error("Id required to update the Stock");
  }

  try {
    const updatedStock = await Stock.findByIdAndUpdate(
      data.id,
      {
        quantity: data.quantity,
      },
      { new: true, runValidators: true }
    );

    if (!updatedStock) {
      throw new Error("Stock record not found");
    }

    return updatedStock;
  } catch (error) {
    console.error("Error updating stock quantity details:", error.message);
    throw new Error("Failed to update stock details");
  }
};
module.exports = {
  addSuppliedStock,
  getAllStock,
  deleteStock,
  getAllStockWithReturns,
  updateCombinedStockAndReturn,
  updateStock,
};
