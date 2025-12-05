const Supplier = require("./supplier.mongo");
const Item = require("./item.mongo");
const Stock = require("./stock.mongo");
const ReturnItems = require("./return.mongo");

const createSupplier = async (data) => {
  try {
    const supplier = await Supplier.create(data);
    return supplier;
  } catch (error) {
    console.error("supplier creation failed");
  }
};

const deleteSupplier = async (id) => {
  if (!id) {
    console.error("ID not found");
  }
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) {
      throw new Error("supplier not found");
    }
    return deletedSupplier;
  } catch (error) {
    console.error("error in supplier deletion", error.message);
  }
};
const updateSupplier = async (data) => {
  if (!data.id) {
    throw new Error("ID not found");
  }
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      data.id,
      {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        totalPayment: data.totalPayment,
      },
      { new: true }
    );
    if (!updatedSupplier) {
      throw new Error("updated Supplier Not Found");
    }
    return updateSupplier;
  } catch (error) {
    console.error("Error in updating supplier", error.message);
    throw error;
  }
};
const getAllSuppliers = async () => {
  try {
    const suppliersList = await Supplier.find({});
    const today = new Date().toDateString();

    for (let sup of suppliersList) {
      if (sup.paymentStatus === "Paid") {
        const paidDate = new Date(sup.lastPaidDate).toDateString();

        if (paidDate !== today) {
          // reset
          sup.paymentStatus = "Pending";
          sup.lastPaidDate = null;
          await sup.save();
        }
      }
    }
    return suppliersList;
  } catch (error) {
    console.error("Error fetching suppliers");
  }
};
const getSupplierWithTotalPayment = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const suppliers = await Supplier.find();

  const result = [];

  for (const supplier of suppliers) {
    const items = await Item.find({ supplierId: supplier._id });

    let todayTotal = 0;

    for (const item of items) {
      const stockToday = await Stock.findOne({
        itemId: item._id,
        date: { $gte: today },
      });

      const returnsToday = await ReturnItems.find({
        itemId: item._id,
        date: { $gte: today },
      });

      const totalReturns = returnsToday.reduce(
        (sum, r) => sum + r.returnItem,
        0
      );

      const qtyToday = stockToday ? stockToday.quantity : 0;

      todayTotal += (qtyToday - totalReturns) * item.cost;
    }

    result.push({
      _id: supplier._id,
      fullName: supplier.fullName,
      phoneNumber: supplier.phoneNumber,
      totalPayment: todayTotal, // TODAY ONLY
      paymentStatus: supplier.paymentStatus,
    });
  }

  return result;
};

const toggleSupplierPaymentStatus = async (supplierId) => {
  const supplier = await Supplier.findById(supplierId);
  if (!supplier) {
    throw new Error("Supplier not found");
  }

  if (supplier.paymentStatus === "Paid") {
    supplier.paymentStatus = "Pending";
    supplier.lastPaidDate = null;
  } else {
    supplier.paymentStatus = "Paid";
    supplier.lastPaidDate = new Date(); // store today's date
  }

  const updatedSupplier = await supplier.save();
  return updatedSupplier;
};

const updateSupplierTotalPayment = async (supplierId) => {
  const items = await Item.find({ supplierId });
  let totalPayment = 0;

  for (const item of items) {
    const stock = await Stock.findOne({ itemId: item._id });
    const ret = await ReturnItems.findOne({ itemId: item._id });

    const quantity = stock ? stock.quantity : 0;
    const returnQty = ret ? ret.returnItem : 0;
    const payment = item.cost * (quantity - returnQty);

    totalPayment += payment;
  }

  return totalPayment;
};
// const recalcSupplierPayment = async (supplierId) => {
//   if (!supplierId) throw new Error("Supplier ID is required");

//   const items = await Item.find({ supplierId });
//   let totalPaymentToday = 0;

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   for (const item of items) {
//     const cost = Number(item.cost) || 0;

//     // Only today's stock
//     const stockToday = await Stock.findOne({
//       itemId: item._id,
//       date: { $gte: today },
//     });
//     const todayQty = Math.max(Number(stockToday?.quantity) || 0, 0);

//     // Only today's returns
//     const returnsToday = await ReturnItems.find({
//       itemId: item._id,
//       date: { $gte: today },
//     });
//     const totalReturnsToday = returnsToday.reduce(
//       (sum, r) => sum + (Number(r.returnItem) || 0),
//       0
//     );

//     // Never allow negative quantity
//     const netQty = Math.max(todayQty - totalReturnsToday, 0);

//     totalPaymentToday += netQty * cost;
//   }

//   return totalPaymentToday;
// };
module.exports = {
  createSupplier,
  deleteSupplier,
  updateSupplier,
  getAllSuppliers,
  getSupplierWithTotalPayment,
  toggleSupplierPaymentStatus,
  updateSupplierTotalPayment,
  // recalcSupplierPayment,
};
