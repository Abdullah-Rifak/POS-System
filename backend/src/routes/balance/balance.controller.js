// const { addReturnedItems } = require("../../model/return.model");

// const httpAddReturnedItems = async (req, res) => {
//   try {
//     const { itemId, returnItem } = req.body;
//     if (!itemId || returnItem < 0) {
//       return res.status(400).json("Invalid Item or number of returned Items");
//     }
//     const result = await addReturnedItems(itemId, returnItem);
//     return res.status(201).json({
//       message: "Returned items added successfully",
//       item: result.item,
//       returnEntry: result.returnEntry,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error adding returned items",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  httpAddReturnedItems,
};
