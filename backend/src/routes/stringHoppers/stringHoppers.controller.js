const {
  createStringHoppers,
  deleteStringHoppers,
  updateStringHoppers,
  getAllStringHoppers,
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
    console.log(error);
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
    console.log(error);
    return res
      .status(500)
      .json({ message: "error updating hoppers entry", error });
  }
};
module.exports = {
  httpCreateStringHoppers,
  httpGetAllStringHoppers,
  httpDeleteStringHoppers,
  httpUpdateStringHoppers,
};
