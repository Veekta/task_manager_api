require("dotenv").config();
const User = require("./../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const io = require("socket.io")(http);

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //encrypt password
    const salted = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salted);

    if (!(email && password && name)) {
      res.status(400).json({ message: "All input is required" });
    } else {
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        return res
          .status(409)
          .json({ message: "User Already Exist. Please Login" });
      } else {
        const user = await User.create({
          name,
          email,
          password: hashed,
        });

        await user.save();

        res.status(201).json({
          message: "user created",
          data: user,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (user) {
      const checks = await bcrypt.compare(password, user.password);
      if (checks) {
        const token = jwt.sign(
          {
            _id: user._id,
            email: user.email,
            name: user.name,
          },
          process.env.SECRETPASS,
          { expiresIn: "28d" }
        );
        const { password, ...info } = user._doc;
        res.status(200).json({
          message: "succesfully signedin",
          data: { token, ...info },
        });
      }
    } else {
      res.status(400).json({
        message: "not a user, please sign up3",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getTasks = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: "tasks",
      options: { sort: { createdAt: -1 } },
    });
    if (!user) {
      return res.status(404).json({ msg: `No task with id: ${req.params.id}` });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({ msg: `No user with id: ${req.params.id}` });
    }

    res.status(200).json({ message: "user updated", data: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error });
  }
};

// Socket.IO connection handler
io.on("connection", (socket) => {
  // Receive mouse movement data from the client
  socket.on("mouseMovement", (data) => {
    // Store the received data in the database
    const mouseMovement = new MouseMovement(data);
    mouseMovement.save();

    // Broadcast the data to all connected clients
    socket.broadcast.emit("mouseMovement", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

module.exports = {
  getUser,
  registerUser,
  signin,
  getTasks,
  updateUser,
};
