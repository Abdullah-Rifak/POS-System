const {
  getAllSalesman,
  createSalesman,
  deleteSalesman,
  updateSalesman,
} = require("../../model/user.model");

const httpGetAllSalesmen = async (req, res) => {
  try {
    const salesmen = await getAllSalesman();
    return res.status(200).json(salesmen);
  } catch (error) {
    console.error("Error fetching salesmen in controller:", error);
    return res.status(500).json({ message: "Error fetching salesmen" });
  }
};
const httpCreateSalesman = async (req, res) => {
  try {
    const salesman = await createSalesman(req.body);
    return res.status(201).json(salesman);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error creating salesman in controller" });
  }
};
const httpUpdateSalesman = async (req, res) => {
  try {
    const updated = await updateSalesman(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Salesman not found" });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const httpDeleteSalesman = async (req, res) => {
  try {
    const deleted = await deleteSalesman(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Salesman not found" });
    return res.status(200).json({ message: "Salesman deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  httpGetAllSalesmen,
  httpCreateSalesman,
  httpUpdateSalesman,
  httpDeleteSalesman,
};
