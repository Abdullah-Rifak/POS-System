const String_Hoppers = require("./string_hoppers.mongo");

const createStringHoppers = async (data) => {
  try {
    const stringHoppers = new String_Hoppers(data);
    await stringHoppers.save();
    return stringHoppers;
  } catch (error) {
    console.error("error creating stringHoppers", error.message);
    throw error;
  }
};

const getAllStringHoppers = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stringHoppers = await String_Hoppers.find({
      date: { $gte: today },
    }).populate("userId", "userName");

    return stringHoppers;
  } catch (error) {
    console.error("Error fetching stringHoppers", error.message);
    throw error;
  }
};
const deleteStringHoppers = async (id) => {
  if (!id) {
    throw new Error("stringHoppers Id required");
  }
  try {
    const deletedStringHoppers = await String_Hoppers.findByIdAndDelete(id);
    if (!deletedStringHoppers) {
      throw new Error(" StringHoppers not found");
    }
    return deletedStringHoppers;
  } catch (error) {
    console.error("error deleting  StringHoppers", error.message);
    throw new Error("Failed to delete");
  }
};
const updateStringHoppers = async (data) => {
  if (!data.id) {
    throw new Error("Id required to update the StringHoppers");
  }

  try {
    const updatedStringHoppers = await String_Hoppers.findByIdAndUpdate(
      data.id,
      {
        type: data.type,
        amount: data.amount,
      },
      { new: true, runValidators: true }
    );

    if (!updatedStringHoppers) {
      throw new Error("StringHoppers record not found");
    }

    return updatedStringHoppers;
  } catch (error) {
    console.error("Error updating StringHoppers details:", error.message);
    throw new Error("Failed to update StringHoppers details");
  }
};

module.exports = {
  createStringHoppers,
  getAllStringHoppers,
  deleteStringHoppers,
  updateStringHoppers,
};
