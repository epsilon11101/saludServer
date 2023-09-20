const { Router } = require("express");
const { searchProducts } = require("../controllers/search.controller");
const { check } = require("express-validator");
const { fieldValidation, validateJWT } = require("../middlewares");
const router = Router();

router.get(
  "/product",
  [
    // validateJWT,
    check("searchTerm", "Search term is required").not().isEmpty(),
    check("searchTerm", "Search term must be a string").isString(),
    fieldValidation,
  ],
  searchProducts
);

module.exports = router;
