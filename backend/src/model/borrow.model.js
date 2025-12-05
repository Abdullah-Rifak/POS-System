const Borrow = require("./borrow.mongo");

const createBorrow = async (data) => {
  try {
    const borrow = new Borrow(data);
    await borrow.save();
    return borrow;
  } catch (error) {
    console.error("error creating item", error.message);
    throw error;
  }
};

const getAllBorrowals = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const borrowalList = await Borrow.find({
      today: { $gte: today },
    }).populate("userId", "userName");

    return borrowalList;
  } catch (error) {
    console.error("Error fetching borrowals", error.message);
    throw error;
  }
};
const deleteBorrow = async (id) => {
  if (!id) {
    throw new Error("Borrowal Id required");
  }
  try {
    const deletedBorrowal = await Borrow.findByIdAndDelete(id);
    if (!deletedBorrowal) {
      throw new Error("Borrowa4l not found");
    }
    return deletedBorrowal;
  } catch (error) {
    console.error("error deleting borrowal", error.message);
    throw new Error("Failed to delete");
  }
};
const updateBorrowal = async (data) => {
  if (!data.id) {
    throw new Error("Id required to update the item");
  }

  try {
    const updatedBorrowal = await Borrow.findByIdAndUpdate(
      data.id,
      {
        borrowerName: data.borrowerName,
        amount: data.amount,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBorrowal) {
      throw new Error("Borrowal record not found");
    }

    return updatedBorrowal;
  } catch (error) {
    console.error("Error updating borrowal details:", error.message);
    throw new Error("Failed to update borrowal details");
  }
};
const toggleBorrowerPaymentStatus = async (borrowerId) => {
  const borrower = await Borrow.findById(borrowerId);
  if (!borrower) {
    throw new Error("borrower not found");
  }

  // Toggle between Paid and Pending
  borrower.borrowalStatus =
    borrower.borrowalStatus === "returned" ? "pending" : "returned";

  const updatedBorrower = await borrower.save();
  return updatedBorrower;
};
module.exports = {
  createBorrow,
  getAllBorrowals,
  deleteBorrow,
  updateBorrowal,
  toggleBorrowerPaymentStatus,
};
