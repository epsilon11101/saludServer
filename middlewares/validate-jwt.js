const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const validateJWT = async (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "There is not token on petition",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        msg: "Invalid token- this user does not exist",
      });
    }
    //validate if uid if status === true
    if (!user.status) {
      return res.status(401).json({
        msg: "Invalid token - deleted user",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "no valid token",
    });
  }
};

module.exports = {
  validateJWT,
};
