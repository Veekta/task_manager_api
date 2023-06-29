const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  description: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Task", taskSchema);
