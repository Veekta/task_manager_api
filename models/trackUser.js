const mongoose = require("mongoose");

const mouseMovementSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  x: Number,
  y: Number,
});

// Create a model based on the schema
const MouseMovement = mongoose.model("MouseMovement", mouseMovementSchema);

module.exports = MouseMovement;
