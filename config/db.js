require("dotenv").config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, console.log("DB connected"))
  .catch((err) => console.log(err));
