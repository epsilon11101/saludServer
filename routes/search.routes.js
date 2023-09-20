/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Endpoints related to searching products
 */

/**
 * @swagger
 * /api/search/product:
 *   get:
 *     summary: Search for products by a search term
 *     tags: [Search]
 *     parameters:
 *       - name: searchTerm
 *         in: query
 *         required: true
 *         description: The search term to look for products
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products matching the search term retrieved successfully
 *       400:
 *         description: Bad request
 */
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
