/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products management API
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products.
 *       500:
 *         description: Internal server error.
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to retrieve.
 *     responses:
 *       200:
 *         description: Product retrieved successfully.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       401:
 *         description: Unauthorized. Invalid or expired token.
 *       404:
 *         description: Not found. Product not found for the specified ID.
 *       500:
 *         description: Internal server error.
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *               category:
 *                 type: string
 *                 description: The category ID of the product
 *             required:
 *               - name
 *               - category
 *     responses:
 *       200:
 *         description: Product created successfully.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       401:
 *         description: Unauthorized. Invalid or expired token.
 *       500:
 *         description: Internal server error.
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the product
 *               category:
 *                 type: string
 *                 description: The updated category ID of the product
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       401:
 *         description: Unauthorized. Invalid or expired token.
 *       404:
 *         description: Not found. Product not found for the specified ID.
 *       500:
 *         description: Internal server error.
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to delete.
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       401:
 *         description: Unauthorized. Invalid or expired token.
 *       404:
 *         description: Not found. Product not found for the specified ID.
 *       500:
 *         description: Internal server error.
 */

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
