const { User } = require("../models");

const getCalories = async (req, res) => {
  const { dailyCalories, notAllowedProducts } = req;
  res.status(200).json({ dailyCalories, notAllowedProducts });
};

const getLoginCalories = async (req, res) => {
  const { dailyCalories, notAllowedProducts, user, userData } = req;
  const updated_userData = {
    ...userData,
    notAllowedProducts,
    dailyRate: dailyCalories,
  };

  const newUser = await await User.findByIdAndUpdate(
    user._id,
    {
      userData: updated_userData,
    },
    { new: true }
  );

  res.status(201).json({ user: newUser });
};

module.exports = {
  getCalories,
  getLoginCalories,
};
