require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");

const connectDb = (async = () => {
  mongoose
    .connect(process.env.MONGODB_URL?.toString())
    .then(() => {
      console.log("Connected SuccessFully");
    })
    .catch((error) => {
      console.log(`Connection failed because of this ${error} `);
    });
});

module.exports = connectDb;
