/**
 * @swagger
 * tags:
 *   name: Day
 *   description: Day activities and calculations API
 * /api/day:
 *   post:
 *     summary: Create a new Day record
 *     tags: [Day]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 description: The date of the Day record (ISO 8601 format)
 *               products:
 *                 type: array
 *                 description: An array of products
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: The title of the product
 *                     weight:
 *                       type: number
 *                       description: The weight of the product
 *                     kcal:
 *                       type: number
 *                       description: The number of kilocalories in the product
 *                     product_id:
 *                       type: string
 *                       description: The ID of the product
 *             required:
 *               - date
 *               - products
 *     responses:
 *       200:
 *         description: Day record created successfully.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       401:
 *         description: Unauthorized. Invalid or expired token.
 *       500:
 *         description: Internal server error.
 *   get:
 *     summary: Get a Day record by date
 *     tags: [Day]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: The date of the Day record to retrieve (ISO 8601 format)
 *     responses:
 *       200:
 *         description: Day record retrieved successfully.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       401:
 *         description: Unauthorized. Invalid or expired token.
 *       404:
 *         description: Not found. Day record not found for the specified date.
 *       500:
 *         description: Internal server error.
 *   delete:
 *     summary: Delete a product from a Day record
 *     tags: [Day]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: The date of the Day record to update (ISO 8601 format)
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to delete from the Day record
 *     responses:
 *       200:
 *         description: Product deleted from the Day record successfully.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       401:
 *         description: Unauthorized. Invalid or expired token.
 *       404:
 *         description: Not found. Day record not found for the specified date.
 *       500:
 *         description: Internal server error.
 */

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
      check("products.*.title", "Mandatory title").not().isEmpty(),
      check("products.*.weight", "Mandatory weight").not().isEmpty(),
      check("products.*.kcal", "Mandatory kcal").not().isEmpty(),
      check("products.*.product_id", "Mandatory product_id").not().isEmpty(),
      check("products.*.title", "Invalid title").isString(),
      check("products.*.weight", "Invalid weight").isNumeric(),
      check("products.*.kcal", "Invalid kcal").isNumeric(),
      check("products.*.product_id", "Invalid product_id").isMongoId(),
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
