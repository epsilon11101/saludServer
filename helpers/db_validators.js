const { Role, User, Category, Product } = require("../models");

const isValidRole = async (role = "") => {
  const isRoleExists = await Role.findOne({ role });
  if (!isRoleExists) {
    throw new Error(`this ${role} is no register in DB`);
  }
};

const isEmailExists = async (email = "") => {
  const isExists = await User.findOne({ email });
  if (isExists) {
    throw new Error(`this email: [${email}] already exists`);
  }
};

const isUserByIdExists = async (id = "") => {
  const isExists = await User.findById(id);
  if (!isExists) {
    throw new Error(`this id: [${id}] no exists`);
  }
};

const isValidCategory = async (id = "") => {
  const isExists = await Category.findById(id);
  if (!isExists) {
    throw new Error(`this id: [${id}] no exists`);
  }
};

const isValidCategoryName = async (name = "") => {
  name = name.toUpperCase();
  const isExists = await Category.findOne({ name });
  if (isExists) {
    throw new Error(`this name: [${name}] is already in DB`);
  }
};

const isValidProduct = async (id = "") => {
  const isExists = await Product.findById(id);
  if (!isExists) {
    throw new Error(`this id: [${id}] no exists`);
  }
};

module.exports = {
  isValidRole,
  isEmailExists,
  isUserByIdExists,
  isValidCategory,
  isValidCategoryName,
  isValidProduct,
};
