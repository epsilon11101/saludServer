const { Schema, model } = require("mongoose");
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - userData
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         userData:
 *           type: object
 *           properties:
 *             weight:
 *               type: number
 *               description: The weight of the user
 *             desiredWeight:
 *               type: number
 *               description: The user's desired weight
 *             groupBlood:
 *               type: string
 *               description: The user's blood group
 *             height:
 *               type: number
 *               description: The height of the user
 *             age:
 *               type: number
 *               description: The age of the user
 *             dailyRate:
 *               type: number
 *               description: The user's daily rate
 *             notAllowedProducts:
 *               type: array
 *               items:
 *                 type: string
 *               description: An array of not allowed products for the user
 *         status:
 *           type: boolean
 *           description: The status of the user
 *         google:
 *           type: boolean
 *           description: Indicates if the user signed up with Google
 *         token:
 *           type: string
 *           description: The user's token
 */

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
  },
  email: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
  userData: {
    weight: {
      type: Number,
      required: [true, "The weight is required"],
    },
    desiredWeight: {
      type: Number,
      required: [true, "The desiredWeight is required"],
    },
    groupBlood: {
      type: String,
      required: [true, "The groupBlood is required"],
    },
    height: {
      type: Number,
      required: [true, "The height is required"],
    },
    age: {
      type: Number,
      required: [true, "The age is required"],
    },
    dailyRate: {
      type: Number,
      default: 0,
    },
    notAllowedProducts: {
      type: Array,
      default: [],
    },
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: null,
  },
});

UserSchema.methods.toJSON = function () {
  // remove version and password and the other fields
  //will be save in user
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("User", UserSchema);
