const { Router } = require("express");
const { check } = require("express-validator");

const { fieldValidation } = require("../middlewares/validateFields");

const { validateJWT } = require("../middlewares/validate-jwt");
const {
  calculateDaily,
  recalculateDaily,
} = require("../middlewares/daily.middleware");
const {
  postDay,
  getDay,
  deleteProduct,
} = require("../controllers/day.controller");

const router = Router();

router
  .post(
    "/",
    [
      validateJWT,
      check("date", "Mandatory date").not().isEmpty(),
      check("products", "Mandatory products").not().isEmpty(),
      check("date", "Invalid date").isISO8601().toDate(),
      check("products", "Invalid products").isArray(),
      fieldValidation,
      calculateDaily,
    ],
    postDay
  )
  .get(
    "/:date",
    [
      validateJWT,
      check("date", "Mandatory date").not().isEmpty(),
      check("date", "Invalid date").isISO8601().toDate(),
      fieldValidation,
    ],
    getDay
  )
  .delete(
    "/:date",
    [
      validateJWT,
      check("date", "Mandatory date").not().isEmpty(),
      check("date", "Invalid date").isISO8601().toDate(),
      check("product_id", "Mandatory product_id").not().isEmpty(),
      check("product_id", "Invalid product_id").isMongoId(),
      fieldValidation,
      recalculateDaily,
    ],
    deleteProduct
  );

module.exports = router;
