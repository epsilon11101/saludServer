/**
 * @swagger
 * tags:
 *   name: Health Products
 *   description: Endpoints related to health products
 */

/**
 * @swagger
 * /api/health-products:
 *   get:
 *     summary: Get all health products
 *     tags: [Health Products]
 *     responses:
 *       200:
 *         description: List of health products retrieved successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/health-products/not-recommended/{bloodGroup}:
 *   get:
 *     summary: Get health products not recommended for a specific blood group
 *     tags: [Health Products]
 *     parameters:
 *       - name: bloodGroup
 *         in: path
 *         required: true
 *         description: Blood group for which products are not recommended
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of health products not recommended for the specified blood group retrieved successfully
 *       400:
 *         description: Bad request
 */
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
