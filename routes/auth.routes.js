/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints related to user authentication
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
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
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Sign in with Google
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in with Google successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */

const { Router } = require("express");
const { check } = require("express-validator");
const {
  login,
  logout,
  googleSignIn,
  signUp,
} = require("../controllers/auth.controller");
const { fieldValidation } = require("../middlewares/validateFields");
const { isEmailExists } = require("../helpers/db_validators");
const {
  calculateCalories,
  getNotAllowedProducts,
} = require("../middlewares/daily.middleware");
const { validateJWT } = require("../middlewares");

const router = Router();

router
  .post(
    "/signup",
    [
      check("email", "Mandatory email").isEmail(),
      check("email").custom(isEmailExists),
      check("password", "Mandatory password").not().isEmpty(),
      check("name", "Mandatory name").not().isEmpty(),
      check(["height", "weight", "age", "desiredWeight", "groupBlood"])
        .not()
        .isEmpty(),
      check([
        "height",
        "weight",
        "age",
        "desiredWeight",
        "groupBlood",
      ]).isNumeric(),
      fieldValidation,
      calculateCalories,
      getNotAllowedProducts,
    ],
    signUp
  )
  .post(
    "/login",
    [
      check("email", "Mandatory email").isEmail(),
      check("password", "Mandatory password").not().isEmpty(),
      fieldValidation,
    ],
    login
  )
  .post(
    "/google",
    [
      check("id_token", "Mandatory GOOGLE ID TOKEN").not().isEmpty(),
      fieldValidation,
    ],
    googleSignIn
  )
  .post("/logout", [validateJWT], logout);

module.exports = router;
