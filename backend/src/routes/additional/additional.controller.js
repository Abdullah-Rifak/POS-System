const {
  createAdditional,
  getAllAdditional,
  deleteAdditional,
} = require("../../model/additional.model");

const httpCreateAdditional = async (req, res) => {
  try {
    const data = req.body;

    data.salesmanName = req.user.userName;
    data.userId = req.user.id;

    const additional = await createAdditional(data);
    return res
      .status(201)
      .json({ message: "Borrow additional", data: additional });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error in creating additional in controller", error });
  }
};
const httpGetAllAdditionals = async (req, res) => {
  try {
    return res.status(201).send(await getAllAdditional());
  } catch (error) {
    return res.status(500).send({
      message: "Error in getting additionals in controller",
      error: error.message,
    });
  }
};
const httpDeleteAdditional = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAdditional = await deleteAdditional(id);
    return res
      .status(200)
      .json({ message: "additional deleted successfully", deleteAdditional });
  } catch (error) {
    return res.status(500).send({
      message: "Error deleting additional in controller",
      error: error.message,
    });
  }
};
module.exports = {
  httpCreateAdditional,
  httpDeleteAdditional,
  httpGetAllAdditionals,
};
