const {
  addSuppliedStock,
  getAllStock,
  getAllStockWithReturns,
  deleteStock,
  updateCombinedStockAndReturn,
  updateStock,
} = require("../../model/stock.model");

const httpAddSuppliedStock = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    if (!itemId || !quantity || quantity <= 0) {
      return res.status(400).json("Invalid item or quantity");
    }
    const result = await addSuppliedStock(itemId, quantity);
    return res.status(201).json({
      message: "stock added successfully",
      item: result.item,
      stockEntry: result.stockEntry,
    });
  } catch (error) {
    res.status(500).json({
      message: "error adding stock",
      error: error.message,
    });
  }
};
const httpGetStockByItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const stock = await getStockByItem(itemId);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    return res.status(200).json(stock);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching stock" });
  }
};
const httpGetAllStock = async (req, res) => {
  try {
    const stocks = await getAllStock();
    return res.status(200).json(stocks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stock", error: error.message });
  }
};
const httpGetAllcombinedsstock = async (req, res) => {
  try {
    const combinedStock = await getAllStockWithReturns();
    return res.status(200).json(combinedStock);
  } catch (error) {
    console.error("Error fetching combined stock:", error.message);
    return res.status(500).json({
      message: "Error fetching combined stock",
      error: error.message,
    });
  }
};
const httpDeleteStock = async (req, res) => {
  try {
    const result = await deleteStock(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res
      .status(200)
      .json({ message: "Stock and related returns deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting stock", error: error.message });
  }
};
const httpUpdateCombined = async (req, res) => {
  try {
    const { id } = req.params;
    const { returnItem, quantity } = req.body;

    console.log("[httpUpdateCombined] Received ID:", id);
    console.log("[httpUpdateCombined] Body data:", { returnItem, quantity });

    //  Validate input
    if (!id) return res.status(400).json({ message: "Missing stock ID" });
    if (returnItem == null || quantity == null)
      return res
        .status(400)
        .json({ message: "Missing fields: returnItem or quantity" });

    //  Perform the update
    const result = await updateCombinedStockAndReturn(id, {
      returnItem,
      quantity,
    });

    //  Send success response
    res.status(200).json({
      success: true,
      message: "Return and Stock updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in httpUpdateCombined:", error);

    //  Distinguish logic vs system error
    if (error.message.includes("not found")) {
      return res.status(404).json({ success: false, message: error.message });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const httpUpdateStock = async (req, res) => {
  try {
    const updatedStock = await updateStock({
      id: req.params.id,
      ...req.body,
    });
    return res
      .status(201)
      .json({ message: "stock entry updated", updatedStock });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error updating Stock entry", error });
  }
};
module.exports = {
  httpAddSuppliedStock,
  httpGetStockByItem,
  httpGetAllStock,
  httpGetAllcombinedsstock,
  httpDeleteStock,
  httpUpdateCombined,
  httpUpdateStock,
};
