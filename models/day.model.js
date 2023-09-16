const { Schema, model } = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Day:
 *       type: object
 *       required:
 *         - date
 *         - products
 *         - user
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the day's record
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the product
 *               weight:
 *                 type: number
 *                 description: The weight of the product
 *               kcal:
 *                 type: number
 *                 description: The number of kilocalories in the product
 *               product_id:
 *                 type: string
 *                 description: The ID of the product
 *             required:
 *               - title
 *               - weight
 *               - kcal
 *               - product_id
 *         daily:
 *           type: object
 *           properties:
 *             left:
 *               type: number
 *               description: The remaining value
 *             consumed:
 *               type: number
 *               description: The consumed value
 *             total:
 *               type: number
 *               description: The total value
 *             normal:
 *               type: number
 *               description: The normal value
 *         user:
 *           type: string
 *           description: The ID of the user associated with this day's record
 */

const DaySchema = Schema({
  date: {
    type: Date,
    required: true,
  },
  products: [
    {
      title: { type: String, required: true },
      weight: { type: Number, required: true },
      kcal: { type: Number, required: true },
      product_id: { type: String, required: true },
    },
  ],
  daily: {
    left: {
      type: Number,
    },
    consumed: {
      type: Number,
    },
    total: {
      type: Number,
    },
    normal: {
      type: Number,
    },
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Day", DaySchema);
