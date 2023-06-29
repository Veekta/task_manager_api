const express = require("express");
const {
  registerUser,
  signin,
  getTasks,
  updateUser,
  getUser,
} = require("../controller/user");
const router = express.Router();

router.post("/signup", registerUser);

router.post("/signin", signin);

router.get("/:userId/tasks", getTasks);

router.get("/:userId", getUser);

router.patch("/:userId", updateUser);

module.exports = router;
