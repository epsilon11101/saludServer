const { Router } = require("express");
const { check } = require("express-validator");

const { fieldValidation } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validate-jwt");
const {
  addProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");

const { isValidCategory, isValidProduct } = require("../helpers/db_validators");
const { isAdminRole } = require("../middlewares");

const router = Router();

router
  .get("/", getAllProducts)
  .get(
    "/:id",
    [
      check("id", "invalid id").isMongoId(),
      check("id").custom(isValidProduct),
      fieldValidation,
    ],
    getProductById
  )
  .post(
    "/",
    [
      validateJWT,
      check("name", "Mandatory name").not().isEmpty(),
      check("category", "Invalid category").isMongoId(),
      check("category").custom(isValidCategory),
      fieldValidation,
    ],
    addProduct
  )
  .put(
    "/:id",
    [
      validateJWT,
      check("id", "invalid id").isMongoId(),
      check("category").custom(isValidCategory),

      fieldValidation,
    ],
    updateProduct
  )
  .delete(
    "/:id",
    [
      validateJWT,
      isAdminRole,
      check("id", "invalid id").isMongoId(),
      check("id").custom(isValidProduct),
      fieldValidation,
    ],
    deleteProduct
  );

module.exports = router;
