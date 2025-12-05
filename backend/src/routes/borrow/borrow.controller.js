const {
  createBorrow,
  getAllBorrowals,
  deleteBorrow,
  updateBorrowal,
  toggleBorrowerPaymentStatus,
} = require("../../model/borrow.model");

const httpCreateBorrow = async (req, res) => {
  try {
    const data = req.body;

    data.salesmanName = req.user.userName;
    data.userId = req.user.id;

    const borrow = await createBorrow(data);
    return res.status(201).json({ message: "Borrow created", data: borrow });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error in creating borrowal in controller", error });
  }
};
const httpGetAllBorrowals = async (req, res) => {
  try {
    return res.status(201).send(await getAllBorrowals());
  } catch (error) {
    return res.status(500).send({
      message: "Error in getting borrowals in controller",
      error: error.message,
    });
  }
};
const httpDeleteBorrowal = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBorrowal = await deleteBorrow(id);
    return res
      .status(200)
      .json({ message: "item deleted successfully", deletedBorrowal });
  } catch (error) {
    return res.status(500).send({
      message: "Error deleting Borrowal in controller",
      error: error.message,
    });
  }
};
const httpUpdateBorrowal = async (req, res) => {
  try {
    const updatedBorrowal = await updateBorrowal({
      id: req.params.id,
      ...req.body,
    });

    return res.status(200).json({
      message: "Borrowal updated successfully",
      updatedBorrowal,
    });
  } catch (error) {
    if (
      error.message === "Update not found" ||
      error.message === "Id required to update the Borrowal"
    ) {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Error in updating borrowal in controller",
      error: error.message,
    });
  }
};
const httpToggleBorrowerPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[httpToggleBorrowerPaymentStatus] Borrower ID: ${id}`);

    const updatedBorrower = await toggleBorrowerPaymentStatus(id);

    res.status(200).json({
      message: "Payment status updated successfully",
      data: updatedBorrower,
    });
  } catch (error) {
    console.error("Error in httpToggleBorrowerPaymentStatus:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
module.exports = {
  httpCreateBorrow,
  httpGetAllBorrowals,
  httpDeleteBorrowal,
  httpUpdateBorrowal,
  httpToggleBorrowerPaymentStatus,
};
