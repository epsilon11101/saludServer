/**
 * @swagger
 * tags:
 *   name: Daily
 *   description: Daily activities and calculations API
 * /api/daily:
 *   post:
 *     summary: Calculate daily calories and nutrition
 *     tags: [Daily]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               height:
 *                 type: number
 *                 description: The user's height
 *               weight:
 *                 type: number
 *                 description: The user's weight
 *               age:
 *                 type: number
 *                 description: The user's age
 *               desiredWeight:
 *                 type: number
 *                 description: The user's desired weight
 *               groupBlood:
 *                 type: string
 *                 description: The user's blood group
 *             required:
 *               - height
 *               - weight
 *               - age
 *               - desiredWeight
 *               - groupBlood
 *     responses:
 *       200:
 *         description: Daily calories and nutrition calculated successfully.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       500:
 *         description: Internal server error.
 * /api/daily/{id}:
 *   patch:
 *     summary: Update and calculate daily calories and nutrition for a logged-in user
 *     tags: [Daily]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               height:
 *                 type: number
 *                 description: The user's height
 *               weight:
 *                 type: number
 *                 description: The user's weight
 *               age:
 *                 type: number
 *                 description: The user's age
 *               desiredWeight:
 *                 type: number
 *                 description: The user's desired weight
 *               groupBlood:
 *                 type: string
 *                 description: The user's blood group
 *             required:
 *               - height
 *               - weight
 *               - age
 *               - desiredWeight
 *               - groupBlood
 *     responses:
 *       200:
 *         description: Daily calories and nutrition updated and recalculated successfully.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       401:
 *         description: Unauthorized. Invalid or expired token.
 *       500:
 *         description: Internal server error.
 */

const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidation } = require("../middlewares/validateFields");

const { validateJWT } = require("../middlewares/validate-jwt");
const {
  getCalories,
  getLoginCalories,
} = require("../controllers/daily.controler");

const {
  calculateCalories,
  getNotAllowedProducts,
} = require("../middlewares/daily.middleware");

const router = Router();

router
  .post(
    "/",
    [
      check(
        ["height", "weight", "age", "desiredWeight", "groupBlood"],
        "height-weight-age-desiredWeight-groupBlood are required"
      )
        .not()
        .isEmpty(),
      check(
        ["height", "weight", "age", "desiredWeight", "groupBlood"],
        "height-weight-age-desiredWeight-groupBlood must be numeric"
      ).isNumeric(),
      fieldValidation,
      calculateCalories,
      getNotAllowedProducts,
    ],
    getCalories
  )
  .patch(
    "/:id",
    [
      validateJWT,
      check("id", "invalid id").isMongoId(),
      check(
        ["height", "weight", "age", "desiredWeight", "groupBlood"],
        "height-weight-age-desiredWeight-groupBlood are required"
      )
        .not()
        .isEmpty(),
      check(
        ["height", "weight", "age", "desiredWeight", "groupBlood"],
        "height-weight-age-desiredWeight-groupBlood must be numeric"
      ).isNumeric(),
      fieldValidation,
      calculateCalories,
      getNotAllowedProducts,
    ],
    getLoginCalories
  );

module.exports = router;
