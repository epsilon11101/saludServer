const Day = require("../models/day.model");

const postDay = async (req, res) => {
  const { products, date } = req.body;
  const { _id: uid } = req.user;
  const daily = req.daily_data;

  //find day by date and user
  const dayExists = await Day.findOne({ date, user: uid });
  if (dayExists) {
    //update day
    const updatedDay = await Day.findOneAndUpdate(
      { date, user: uid },
      { products, daily },
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
  console.log(date);

  const day = await Day.findOne({ date, user: uid }, {});
  console.log(day);
  if (!day) {
    return res.status(404).json({
      msg: "Day not found",
    });
  }
  return res.status(200).json({
    day,
  });
};

const deleteProduct = async (req, res = response) => {
  const { daily_data, updated_products, found_day } = req;
  console.log(updated_products);
  await found_day.updateOne({ products: updated_products, daily: daily_data });

  res.status(200).json({
    msg: "Product deleted",
    day: found_day,
  });
};
module.exports = {
  postDay,
  getDay,
  deleteProduct,
};
