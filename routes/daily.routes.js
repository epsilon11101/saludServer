const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidation } = require("../middlewares/validateFields");

const { validateJWT } = require("../middlewares/validate-jwt");
const {
  getCalories,
  getLoginCalories,
} = require("../controllers/daily.controler");

const {
  calculateCalories,
  getNotAllowedProducts,
} = require("../middlewares/daily.middleware");

const router = Router();

router
  .post(
    "/",
    [
      check(
        ["height", "weight", "age", "desiredWeight", "groupBlood"],
        "height-weight-age-desiredWeight-groupBlood are required"
      )
        .not()
        .isEmpty(),
      check(
        ["height", "weight", "age", "desiredWeight", "groupBlood"],
        "height-weight-age-desiredWeight-groupBlood must be numeric"
      ).isNumeric(),
      fieldValidation,
      calculateCalories,
      getNotAllowedProducts,
    ],
    getCalories
  )
  .patch(
    "/",
    [
      validateJWT,
      check(
        ["height", "weight", "age", "desiredWeight", "groupBlood"],
        "height-weight-age-desiredWeight-groupBlood are required"
      )
        .not()
        .isEmpty(),
      check(
        ["height", "weight", "age", "desiredWeight", "groupBlood"],
        "height-weight-age-desiredWeight-groupBlood must be numeric"
      ).isNumeric(),
      fieldValidation,
      calculateCalories,
      getNotAllowedProducts,
    ],
    getLoginCalories
  );

module.exports = router;
