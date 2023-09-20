const { HealthProduct } = require("../models");
const { ObjectId } = require("mongoose").Types;

const searchProducts = async (req, res) => {
  const { searchTerm } = req.query;

  const isMongoId = ObjectId.isValid(searchTerm);
  if (isMongoId) {
    const product = await HealthProduct.findById(searchTerm);
    return res.status(200).json({
      results: product ? [product] : [],
    });
  }

  const regex = new RegExp(searchTerm, "i");

  const products = await HealthProduct.find({
    title: regex,
  });

  res.status(200).json({
    results: products,
  });
};

module.exports = {
  searchProducts,
};
