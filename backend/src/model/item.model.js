const items = require("./item.mongo");
//const mongoose = require("mongoose");

const createItem = async (data) => {
  try {
    const item = new items(data);
    await item.save();
    return item;
  } catch (error) {
    console.error("error creating item", error.message);
    throw error;
  }
};

const getAllItems = async () => {
  try {
    const itemList = await items.find({}).populate("supplierId", "fullName");
    return itemList;
  } catch (error) {
    console.error("Error fetching items", error.message);
    throw error;
  }
};

const deleteItem = async (id) => {
  if (!id) {
    throw new Error("Item Id required");
  }
  try {
    const deletedItem = await items.findByIdAndDelete(id);
    if (!deletedItem) {
      throw new Error("Item not found");
    }
    return deletedItem;
  } catch (error) {
    console.error("error deleting item", error.message);
    throw new Error("Failed to delete");
  }
};
const updateItem = async (data) => {
  if (!data.id) {
    throw new Error("Id required to update the item");
  }
  try {
    const updatedItem = await items.findByIdAndUpdate(
      data.id,
      {
        itemName: data.itemName,
        cost: data.cost,
        price: data.price,
      },
      { new: true }
    );
    if (!updatedItem) {
      throw new Error("Update not found");
    }
    return updateItem;
  } catch (error) {
    console.error("Error updating item details", error.message);
  }
};

module.exports = {
  createItem,
  getAllItems,
  deleteItem,
  updateItem,
};
