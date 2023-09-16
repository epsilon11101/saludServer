/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication API
 * /api/signup:
 *   post:
 *     summary: Sign up as a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User successfully registered.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       500:
 *         description: Internal server error.
 * /api/login:
 *   post:
 *     summary: Log in with existing credentials
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
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The user's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User successfully logged in.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       401:
 *         description: Unauthorized. Invalid credentials.
 *       500:
 *         description: Internal server error.
 * /api/google:
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
 *                 description: The Google ID token
 *             required:
 *               - id_token
 *     responses:
 *       200:
 *         description: User successfully signed in with Google.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       401:
 *         description: Unauthorized. Invalid Google ID token.
 *       500:
 *         description: Internal server error.
 * /api/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully logged out.
 *       401:
 *         description: Unauthorized. Invalid or expired token.
 *       500:
 *         description: Internal server error.
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
