const Additional = require("./additional.mongo");

const createAdditional = async (data) => {
  try {
    const additional = new Additional(data);
    await additional.save();
    return additional;
  } catch (error) {
    console.error("error creating additional expences schema", error.message);
    throw error;
  }
};
const getAllAdditional = async () => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const additionalList = await Additional.find({
      date: { $gte: todayStart },
    }).populate("userId", "userName");

    return additionalList;
  } catch (error) {
    console.error("Error fetching Additional expenses", error.message);
    throw error;
  }
};
const deleteAdditional = async (id) => {
  if (!id) {
    throw new Error("Additional Id required");
  }
  try {
    const deletedAdditional = await Additional.findByIdAndDelete(id);
    if (!deletedAdditional) {
      throw new Error("Additional not found");
    }
    return deletedAdditional;
  } catch (error) {
    console.error("error deleting Additional", error.message);
    throw new Error("Failed to delete");
  }
};

module.exports = { createAdditional, getAllAdditional, deleteAdditional };
