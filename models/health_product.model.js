const { Schema, model } = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthProduct:
 *       type: object
 *       required:
 *         - categories
 *         - weight
 *         - title
 *         - calories
 *         - groupBloodNotAllowed
 *       properties:
 *         categories:
 *           type: string
 *           description: The categories of the health product
 *         weight:
 *           type: number
 *           description: The weight of the health product
 *         title:
 *           type: string
 *           description: The title of the health product
 *         calories:
 *           type: number
 *           description: The number of calories in the health product
 *         groupBloodNotAllowed:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of blood groups not allowed to consume the health product
 */

const HealthProductSchema = Schema({
  categories: {
    type: String,
    required: [true, "The categories is required"],
  },
  weight: {
    type: Number,
    required: [true, "The weight is required"],
  },
  title: {
    type: String,
    required: [true, "The title is required"],
  },
  calories: {
    type: Number,
    required: [true, "The calories is required"],
  },
  groupBloodNotAllowed: {
    type: Array,
    required: [true, "The groupBloodNotAllowed is required"],
  },
});

HealthProductSchema.methods.toJSON = function () {
  // remove version and password and the other fields
  //will be save in user
  const { __v, ...healthProduct } = this.toObject();
  return healthProduct;
};

module.exports = model("HealthProduct", HealthProductSchema);
