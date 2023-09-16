/**
 * @swagger
 * tags:
 *   name: HealthProducts
 *   description: Health products management API
 * /api/health-products:
 *   get:
 *     summary: Get all health products
 *     tags: [HealthProducts]
 *     responses:
 *       200:
 *         description: List of all health products.
 *       500:
 *         description: Internal server error.
 * /api/health-products/not-recommended/{bloodGroup}:
 *   get:
 *     summary: Get health products not recommended for a specific blood group
 *     tags: [HealthProducts]
 *     parameters:
 *       - in: path
 *         name: bloodGroup
 *         schema:
 *           type: string
 *         required: true
 *         description: The blood group for which not recommended health products are requested.
 *     responses:
 *       200:
 *         description: List of health products not recommended for the specified blood group.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       500:
 *         description: Internal server error.
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
