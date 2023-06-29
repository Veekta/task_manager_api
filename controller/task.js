const mongoose = require("mongoose");
const Task = require("./../models/task");
const User = require("./../models/user");

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const user = await User.findById(req.params.userId);
    const newTask = new Task({
      title: title,
      description: description,
    });

    newTask.user = user;
    newTask.save();

    user.tasks.push(new mongoose.Types.ObjectId(newTask._id));
    user.save();

    res.status(201).json({
      status: "SUCCESS",
      data: newTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

const getUserTask = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      const task = await Task.findById(req.params.taskId);

      res.status(200).json({ data: task });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

const updateUserTask = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const user = await User.findById(req.params.userId);
    if (user) {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.taskId },
        {
          title,
          description,
          completed,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({ data: task });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const task = await Task.findByIdAndRemove(req.params.taskId);
    user.tasks.pull(task);
    user.save();
    res.status(200).json({ data: null, status: "task deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createTask,
  getUserTask,
  updateUserTask,
  deleteTask,
};
