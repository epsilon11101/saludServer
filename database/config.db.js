const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log("successfully reading DB");
  } catch (error) {
    console.log(error);
    throw new Error("error reading DB");
  }
};

module.exports = {
  dbConnection,
};
