/**
 * @swagger
 * tags:
 *   name: Day Records
 *   description: Endpoints related to daily records and products
 */

/**
 * @swagger
 * /api/day:
 *   post:
 *     summary: Add a daily record
 *     tags: [Day Records]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Day record added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/day/{date}:
 *   get:
 *     summary: Get a day record by date
 *     tags: [Day Records]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: date
 *         in: path
 *         required: true
 *         description: Date of the day record
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Day record retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Day record not found
 */

/**
 * @swagger
 * /api/day/{date}:
 *   delete:
 *     summary: Delete a product from a day record
 *     tags: [Day Records]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: date
 *         in: path
 *         required: true
 *         description: Date of the day record
 *         schema:
 *           type: string
 *           format: date
 *       - name: product_id
 *         in: query
 *         required: true
 *         description: ID of the product to be deleted
 *         schema:
 *           type: string
 *           format: mongodb-id
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Day record not found
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
