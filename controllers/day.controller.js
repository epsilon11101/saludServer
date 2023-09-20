const Day = require("../models/day.model");

const postDay = async (req, res) => {
  const { products, date } = req.body;
  const { _id: uid } = req.user;
  const daily = req.daily_data;

  //find day by date and user
  const dayExists = await Day.findOne({ date, user: uid });
  if (dayExists) {
    //update day
    const AllProducts = [...dayExists.products, ...products];

    const updatedDay = await Day.findOneAndUpdate(
      { date, user: uid },
      { products: AllProducts, daily },
      { new: true }
    );

    return res.status(201).json({
      msg: "Day updated",
      day: updatedDay,
    });
  }

  const day = await new Day({
    date,
    daily,
    products,
    user: uid,
  });
  await day.save();

  res.status(200).json({
    msg: "Day saved",
    day,
  });
};

const getDay = async (req, res) => {
  const { date } = req.params;
  const { _id: uid } = req.user;

  const day = await Day.findOne({ date, user: uid }, {});

  if (!day) {
    return res.status(200).json({
      day: null,
      msg: "No day found",
    });
  }
  return res.status(200).json({
    day,
  });
};

const deleteProduct = async (req, res = response) => {
  const { daily_data, updated_products, found_day } = req;

  const updated_day = await Day.findOneAndUpdate(
    { _id: found_day._id },
    { products: updated_products, daily: daily_data },
    { new: true }
  );

  res.status(200).json({
    msg: "Product deleted",
    day: updated_day,
  });
};
module.exports = {
  postDay,
  getDay,
  deleteProduct,
};
