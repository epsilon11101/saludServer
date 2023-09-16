const bcryptjs = require("bcryptjs");
const User = require("../models/user.model");
const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/google-verify");
const { json } = require("express");

const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  const { dailyCalories, notAllowedProducts, userData } = req;
  console.log("userData", userData);
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({
        msg: "User already exists",
      });
    }
    const user = {
      name,
      email,
      password,
      userData: {
        ...userData,
        dailyRate: dailyCalories,
        notAllowedProducts: notAllowedProducts,
      },
    };

    const newUser = await new User(user);

    //encrypt password default 10
    const salt = bcryptjs.genSaltSync();
    newUser.password = bcryptjs.hashSync(password, salt);
    const token = await generateJWT(newUser.id);
    newUser.token = token;

    await newUser.save();

    res.status(200).json({
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "error",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //validate if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "User/Password are invalid - email",
      });
    }

    //validate if users is active
    if (!user.status) {
      return res.status(400).json({
        msg: "User/Password are invalid - status = false",
      });
    }

    // validate password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "User/Password are invalid - password",
      });
    }

    // generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "error",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, picture, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      //create user
      const data = {
        name,
        email,
        password: ":P",
        img: picture,
        google: true,
        role: "USER_ROLE",
      };
      console.log(data);
      user = new User(data);
      await user.save();
    }
    // if the user in DB
    if (!user.status) {
      return res.status(401).json({
        msg: "User blocked",
      });
    }

    // generate JWT
    const token = await generateJWT(user.id);

    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Invalid token",
    });
  }
};

const logout = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(500).json({
      msg: "you want to validate role without validate token first",
    });
  }
  user.token = null;
  await user.save();
  res.status(200).json({
    message: "See you soon",
  });
};

module.exports = {
  login,
  googleSignIn,
  signUp,
  logout,
};
