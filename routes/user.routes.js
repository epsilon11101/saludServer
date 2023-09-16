const { Router } = require("express");
const { isEmailExists, isUserByIdExists } = require("../helpers/db_validators");

const {
  fieldValidation,
  validateJWT,
  isAdminRole,
  hasRole,
} = require("../middlewares");

const {
  getUsers,
  putUsers,
  postUser,
  deleteUser,
  patchUser,
} = require("../controllers/user.controller");

const { check } = require("express-validator");

const router = Router();

router
  .get("/", getUsers)
  .put(
    "/:id",
    [
      check("id", "invalid id").isMongoId(),
      check("id").custom(isUserByIdExists),
      fieldValidation,
    ],

    putUsers
  )
  .post(
    "/",
    [
      check("name", "mandatory name").not().isEmpty(),
      check("password", "password must have 6 chars as minimum").isLength({
        min: 6,
      }),
      check("email", "invalid email").isEmail(),
      check("email").custom(isEmailExists),
      fieldValidation,
    ],
    postUser
  )

  .patch("/", patchUser);

module.exports = router;
