const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  tracks: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MouseMovement",
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
