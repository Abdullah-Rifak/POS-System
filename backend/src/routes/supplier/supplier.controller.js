const {
  createSupplier,
  deleteSupplier,
  updateSupplier,
  getAllSuppliers,
  getSupplierWithTotalPayment,
  toggleSupplierPaymentStatus,
} = require("../../model/supplier.model");

const httpCreateSupplier = async (req, res) => {
  try {
    return res.status(201).json(await createSupplier(req.body));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error creating supplier in the controller" });
  }
};
const httpDeleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSupplier = await deleteSupplier(id);
    return res
      .status(200)
      .json({ message: "supplier deleted successfully", deletedSupplier });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting supplier in controller",
      error: error.message,
    });
  }
};
const httpUpdateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await updateSupplier({
      id: req.params.id,
      ...req.body,
    });
    if (!updatedSupplier) {
      return res.status(404).send({ message: "Supplier not found" });
    }
    return res.status(200).json(updatedSupplier);
  } catch (error) {
    return res.status(500).send({
      message: "Error in updating supplier in controller",
      error: error.message,
    });
  }
};
const httpGetAllSuppliers = async (req, res) => {
  try {
    return res.status(201).send(await getAllSuppliers());
  } catch (error) {
    return res.status(500).send({
      message: "Error in getting suppliers in controller",
      error: error.message,
    });
  }
};
const httpGetSuppliersWithPayment = async (req, res) => {
  try {
    const suppliers = await getSupplierWithTotalPayment();
    res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Server Error" });
  }
};
const httpToggleSupplierPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSupplier = await toggleSupplierPaymentStatus(id);

    res.status(200).json({
      message: "Payment status updated successfully",
      data: updatedSupplier,
    });
  } catch (error) {
    console.error("Error in httpToggleSupplierPaymentStatus:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
module.exports = {
  httpCreateSupplier,
  httpDeleteSupplier,
  httpUpdateSupplier,
  httpGetAllSuppliers,
  httpGetSuppliersWithPayment,
  httpToggleSupplierPaymentStatus,
};
