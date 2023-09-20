const response = require("express");
const { HealthProduct } = require("../models");

const getAllProducts = async (req, res = response) => {
  const [total, products] = await Promise.all([
    HealthProduct.countDocuments(),
    HealthProduct.find(),
  ]);

  res.status(200).json({ total, products });
};

const getNotRecommendedForBloodGroup = async (req, res = response) => {
  const { bloodGroup } = req.params;

  const filter = {
    [`groupBloodNotAllowed.${+bloodGroup}`]: true,
  };
  const products = await HealthProduct.find(filter);

  res.status(200).json({ products });
};

module.exports = {
  getAllProducts,
  getNotRecommendedForBloodGroup,
};
