const {
  createStringHoppers,
  deleteStringHoppers,
  updateStringHoppers,
  getAllStringHoppers,
  getStringHoppersPrice,
  updateStringHoppersPrice,
} = require("../../model/string_hoppers.model");

const httpCreateStringHoppers = async (req, res) => {
  try {
    const data = req.body;
    data.salesmanName = req.user.userName;
    data.userId = req.user.id;

    const stringHoppers = await createStringHoppers(data);
    return res
      .status(201)
      .json({ message: "Entry added", data: stringHoppers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error entring entry", error });
  }
};
const httpGetAllStringHoppers = async (req, res) => {
  try {
    return res.status(201).send(await getAllStringHoppers());
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error getting hoppers entry", error });
  }
};
const httpDeleteStringHoppers = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStringHoppers = await deleteStringHoppers(id);
    res
      .status(201)
      .json({ messaage: "Hoppers entry deleted", deletedStringHoppers });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting hoppers entry", error });
  }
};
const httpUpdateStringHoppers = async (req, res) => {
  try {
    const updatedHoppers = await updateStringHoppers({
      id: req.params.id,
      ...req.body,
    });
    return res
      .status(201)
      .json({ message: "Hoppers entry updated", updatedHoppers });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error updating hoppers entry", error });
  }
};

const httpGetStringHoppersPrice = async (req, res) => {
  try {
    const stringHoppersPrice = await getStringHoppersPrice();
    return res
      .status(200)
      .json({ stringhoppers: { price: stringHoppersPrice.price } });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error getting hoppers price", error });
  }
};

const httpUpdateStringHoppersPrice = async (req, res) => {
  if (!Number.isFinite(Number(req.body.price)) || Number(req.body.price) < 0) {
    return res
      .status(400)
      .json({ message: "Valid non-negative price is required" });
  }

  try {
    const updatedPrice = await updateStringHoppersPrice(req.body.price);
    return res.status(200).json({
      message: "Hoppers price updated",
      stringhoppers: { price: updatedPrice.price },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error updating hoppers price", error: error.message });
  }
};
module.exports = {
  httpCreateStringHoppers,
  httpGetAllStringHoppers,
  httpDeleteStringHoppers,
  httpUpdateStringHoppers,
  httpGetStringHoppersPrice,
  httpUpdateStringHoppersPrice,
};
