const { HealthProduct } = require("../models");
const Day = require("../models/day.model");

const dailyCalc = (products, user) => {
  const totalCalories = user.userData.dailyRate;
  let consumedCalories = 0;

  products.forEach((product) => {
    //compute real calories
    let real_kcal = (100 * product.weight) / product.kcal;
    //compute consumed calories
    consumedCalories += real_kcal;
  });
  const leftCalories = totalCalories - consumedCalories;

  const N_percentage = (consumedCalories / totalCalories) * 100;

  const daily = {
    left: leftCalories,
    consumed: consumedCalories,
    total: totalCalories,
    normal: N_percentage,
  };
  return daily;
};

const calculateCalories = async (req, res, next) => {
  const { height, weight, age, desiredWeight, groupBlood } = req.body;
  const userData = {
    height,
    weight,
    age,
    desiredWeight,
    groupBlood,
  };

  const dailyCalories =
    10 * weight + 6.25 * height - 5 * age - 161 - 10 * (weight - desiredWeight);

  req.dailyCalories = dailyCalories;
  req.userData = userData;
  next();
};

function getRandomObjects(array, numberOfObjects) {
  const shuffledArray = array.slice().sort(() => Math.random() - 0.5);
  return shuffledArray.slice(0, numberOfObjects);
}

const getNotAllowedProducts = async (req, res, next) => {
  let { groupBlood } = req.body;
  const notAllowedProducts = [];

  groupBlood = groupBlood <= 0 ? 1 : groupBlood > 4 ? 4 : groupBlood;

  const filter = {
    [`groupBloodNotAllowed.${groupBlood}`]: true,
  };

  const products = await HealthProduct.find(filter);

  getRandomObjects(products, 4).forEach((product) => {
    notAllowedProducts.push(product.title);
  });

  req.notAllowedProducts = notAllowedProducts;

  next();
};

const calculateDaily = async (req, res, next) => {
  const { products } = req.body;
  const user = req.user;

  const daily = dailyCalc(products, user);

  req.daily_data = daily;
  next();
};

const recalculateDaily = async (req, res, next) => {
  const { user } = req;
  const { date } = req.params;
  const { product_id } = req.query;
  console.log(product_id);
  const day = await Day.findOne({ date, user: user._id });

  if (!day) {
    return res.status(404).json({
      msg: "Day not found",
    });
  }

  const products = day.products.filter(
    (product) => product.product_id != product_id
  );
  console.log("PRODUCTS", products);

  const daily_data = dailyCalc(products, user);

  req.daily_data = daily_data;
  req.updated_products = products;
  req.found_day = day;

  next();
};

module.exports = {
  calculateCalories,
  getNotAllowedProducts,
  calculateDaily,
  recalculateDaily,
};
