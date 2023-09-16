/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Product search API
 * /api/search/product:
 *   get:
 *     summary: Search for products by name
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         required: true
 *         description: The search term to find products by name.
 *     responses:
 *       200:
 *         description: List of products matching the search term.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       401:
 *         description: Unauthorized. Invalid or expired token.
 *       500:
 *         description: Internal server error.
 */

const { Router } = require("express");
const { searchProducts } = require("../controllers/search.controller");
const { check } = require("express-validator");
const { fieldValidation, validateJWT } = require("../middlewares");
const router = Router();

router.get(
  "/product",
  [
    validateJWT,
    check("searchTerm", "Search term is required").not().isEmpty(),
    check("searchTerm", "Search term must be a string").isString(),
    fieldValidation,
  ],
  searchProducts
);

module.exports = router;
