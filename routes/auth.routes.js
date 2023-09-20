const { Router } = require("express");
const { check } = require("express-validator");
const {
  login,
  logout,
  googleSignIn,
  signUp,
} = require("../controllers/auth.controller");
const { fieldValidation } = require("../middlewares/validateFields");
const { isEmailExists } = require("../helpers/db_validators");
const {
  calculateCalories,
  getNotAllowedProducts,
} = require("../middlewares/daily.middleware");
const { validateJWT } = require("../middlewares");

const router = Router();

router
  .post(
    "/signup",
    [
      check("email", "Mandatory email").isEmail(),
      check("email").custom(isEmailExists),
      check("password", "Mandatory password").not().isEmpty(),
      check("name", "Mandatory name").not().isEmpty(),
      check(["height", "weight", "age", "desiredWeight", "groupBlood"])
        .not()
        .isEmpty(),
      check([
        "height",
        "weight",
        "age",
        "desiredWeight",
        "groupBlood",
      ]).isNumeric(),
      fieldValidation,
      calculateCalories,
      getNotAllowedProducts,
    ],
    signUp
  )
  .post(
    "/login",
    [
      check("email", "Mandatory email").isEmail(),
      check("password", "Mandatory password").not().isEmpty(),
      fieldValidation,
    ],
    login
  )
  .post(
    "/google",
    [
      check("id_token", "Mandatory GOOGLE ID TOKEN").not().isEmpty(),
      fieldValidation,
    ],
    googleSignIn
  )
  .post("/logout", [validateJWT], logout);

module.exports = router;
