/**
 * @swagger
 * tags:
 *   name: Daily
 *   description: Endpoints related to daily calorie calculations
 */

/**
 * @swagger
 * /api/daily:
 *   post:
 *     summary: Calculate daily calories
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
 *               weight:
 *                 type: number
 *               age:
 *                 type: number
 *               desiredWeight:
 *                 type: number
 *               groupBlood:
 *                 type: string
 *     responses:
 *       200:
 *         description: Daily calories calculated successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/daily:
 *   patch:
 *     summary: Calculate daily calories (with authentication)
 *     tags: [Daily]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               height:
 *                 type: number
 *               weight:
 *                 type: number
 *               age:
 *                 type: number
 *               desiredWeight:
 *                 type: number
 *               groupBlood:
 *                 type: string
 *     responses:
 *       200:
 *         description: Daily calories calculated successfully (with authentication)
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
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
    "/",
    [
      validateJWT,
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
