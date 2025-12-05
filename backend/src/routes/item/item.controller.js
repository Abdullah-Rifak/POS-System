const {
  createItem,
  getAllItems,
  deleteItem,
  updateItem,
} = require("../../model/item.model");

const httpCreateItem = async (req, res) => {
  try {
    // if (req.user.role !== "Admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }
    return res.status(201).json(await createItem(req.body));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error in creating acccount in controller", error });
  }
};
const httpGetAllItems = async (req, res) => {
  try {
    return res.status(201).send(await getAllItems());
  } catch (error) {
    return res.status(500).send({
      message: "Error in getting items in controller",
      error: error.message,
    });
  }
};
const httpDeleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await deleteItem(id);
    return res
      .status(200)
      .json({ message: "item deleted successfully", deletedItem });
  } catch (error) {
    return res.status(500).send({
      message: "Error deleting item in controller",
      error: error.message,
    });
  }
};
const httpUpdateItem = async (req, res) => {
  try {
    const updatedItem = await updateItem({
      id: req.params.id,
      ...req.body,
    });

    return res.status(200).json({
      message: "Item updated successfully",
      updatedItem,
    });
  } catch (error) {
    if (
      error.message === "Update not found" ||
      error.message === "Id required to update the item"
    ) {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Error in updating item in controller",
      error: error.message,
    });
  }
};
module.exports = {
  httpCreateItem,
  httpGetAllItems,
  httpDeleteItem,
  httpUpdateItem,
};
