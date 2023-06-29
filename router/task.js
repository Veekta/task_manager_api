const express = require("express");
const {
  createTask,
  getUserTask,
  updateUserTask,
  deleteTask,
} = require("../controller/task");
const router = express.Router();

router.post("/:userId", createTask);
router.get("/:userId/:taskId", getUserTask);
router.patch("/:userId/:taskId", updateUserTask);
router.delete("/:userId/:taskId", deleteTask);

module.exports = router;
