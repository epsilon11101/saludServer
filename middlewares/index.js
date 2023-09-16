const fieldValidation = require("./validateFields");
const JWTValidation = require("./validate-jwt");

module.exports = {
  ...fieldValidation,
  ...JWTValidation,
};
