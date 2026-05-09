const String_Hoppers = require("./string_hoppers.mongo");
const String_Hoppers_Price = require("./string_hoppers_price.mongo");

const DEFAULT_STRING_HOPPERS_PRICE = 4;

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
      { new: true, runValidators: true },
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

const getStringHoppersPrice = async () => {
  try {
    const priceDoc = await String_Hoppers_Price.findOneAndUpdate(
      { key: "string_hoppers_price" },
      {
        $setOnInsert: {
          key: "string_hoppers_price",
          price: DEFAULT_STRING_HOPPERS_PRICE,
        },
      },
      { new: true, upsert: true },
    );

    return priceDoc;
  } catch (error) {
    console.error("Error fetching string hoppers price", error.message);
    throw error;
  }
};

const updateStringHoppersPrice = async (price) => {
  if (!Number.isFinite(Number(price)) || Number(price) < 0) {
    throw new Error("Valid non-negative price is required");
  }

  try {
    const updatedPriceDoc = await String_Hoppers_Price.findOneAndUpdate(
      { key: "string_hoppers_price" },
      { key: "string_hoppers_price", price: Number(price) },
      { new: true, upsert: true, runValidators: true },
    );

    return updatedPriceDoc;
  } catch (error) {
    console.error("Error updating string hoppers price", error.message);
    throw error;
  }
};

module.exports = {
  createStringHoppers,
  getAllStringHoppers,
  deleteStringHoppers,
  updateStringHoppers,
  getStringHoppersPrice,
  updateStringHoppersPrice,
};
