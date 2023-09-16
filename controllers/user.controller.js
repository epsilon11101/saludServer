const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user.model");

const getUsers = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const filterQuery = { status: true };

  const [total, users] = await Promise.all([
    User.countDocuments(filterQuery),
    User.find(filterQuery).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    users,
  });
};

const putUsers = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...newProperties } = req.body;

  //VALIDATE WITH DB
  if (password) {
    const salt = bcryptjs.genSaltSync();
    newProperties.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, newProperties);

  res.status(200).json({
    user,
  });
};

const postUser = async (req, res = response) => {
  const {
    name,
    email,
    password,
    weight,
    desiredWeight,
    groupBlood,
    height,
    age,
  } = req.body;
  const user = new User({
    name,
    email,
    password,
    weight,
    desiredWeight,
    groupBlood,
    height,
    age,
  });
  //encrypt password default 10
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);
  //save en DB
  await user.save();
  res.status(200).json({
    user,
  });
};

const patchUser = (req, res = response) => {
  res.json({
    ok: true, //optional param
    msg: "patch API -CONTROLLER",
  });
};

const deleteUser = async (req, res = response) => {
  const { id } = req.params;

  // const user = await User.findByIdAndDelete(id);

  const user = await User.findByIdAndUpdate(id, { status: false });

  res.status(200).json({
    user,
  });
};

module.exports = {
  getUsers,
  putUsers,
  postUser,
  patchUser,
  deleteUser,
};
