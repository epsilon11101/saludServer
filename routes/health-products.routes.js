const { Router } = require("express");
const { check } = require("express-validator");

const { fieldValidation } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validate-jwt");
const {
  getAllProducts,
  getNotRecommendedForBloodGroup,
} = require("../controllers/health-products.controller");

const router = Router();

router.get("/", getAllProducts);
router.get(
  "/not-recommended/:bloodGroup",
  [
    check("bloodGroup", "The bloodGroup is required").not().isEmpty(),
    fieldValidation,
  ],
  getNotRecommendedForBloodGroup
);

module.exports = router;
