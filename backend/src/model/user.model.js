const Users = require("./user.mongo");

const createUser = async (data) => {
  try {
    const user = await Users.create(data);
    return user;
  } catch (error) {
    throw new Error("Error creating user", error.message);
  }
};
const updateUser = async (data) => {
  if (!data.id) {
    console.error("User ID not found");
  }
  try {
    const validRoles = ["salesman", "admin"];
    if (data.role && !validRoles.includes(data.role)) {
      throw new Error("Invalid role");
    }
    const updatedUser = await Users.findByIdAndUpdate(
      data.id,
      {
        userName: data.userName,
        password: data.password,
        role: data.role,
      },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error("Error in updating user", error.message);
  }
};
const getAllUsers = async () => {
  try {
    usersList = await Users.find({});
    return usersList;
  } catch (error) {
    console.error("error in getting users", error.message);
  }
};
const deleteUser = async (id) => {
  if (!id) {
    console.error("User ID not found");
  }
  try {
    const deletedUser = await Users.findByIdAndDelete(id);
    if (!deletedUser) {
      console.error("deleted user not found");
    }
    return deletedUser;
  } catch (error) {
    console.error("Error in deleting user", error.message);
  }
};

const getAllSalesman = async () => {
  try {
    const salesman = await Users.find({ role: "Salesman" });
    return salesman;
  } catch (error) {
    console.error("Error fetching salesmen in service:", error);
    throw new Error("Error fetching salesmen");
  }
};

const createSalesman = async (data) => {
  try {
    const salesman = await Users.create({
      userName: data.userName,
      password: data.password,
      phoneNumber: data.phoneNumber,
      salary: data.salary,
      role: "Salesman",
    });
    return salesman;
  } catch (error) {
    console.error("Error creating salesman:", error);
    throw new Error("Salesman creation failed");
  }
};

const updateSalesman = async (id, data) => {
  try {
    const updated = await Users.findByIdAndUpdate(id, data, { new: true });
    return updated;
  } catch (error) {
    throw new Error("Error updating salesman");
  }
};
const deleteSalesman = async (id) => {
  try {
    const deleted = await Users.findByIdAndDelete(id);
    return deleted;
  } catch (error) {
    throw new Error("Error deleting salesman");
  }
};

module.exports = {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getAllSalesman,
  createSalesman,
  updateSalesman,
  deleteSalesman,
};
