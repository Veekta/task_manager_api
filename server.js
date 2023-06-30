const app = require("express")();
const serve = require("node:http").createServer(app);
require("./config/db");
const MouseMovement = require("./models/trackUser");

// Initialize Socket.IO
const io = require("socket.io")(serve);

const port = process.env.PORT || 5000;
const UserRouter = require("./router/user");
const Task = require("./router/task");

// for accepting post form data
const bodyParser = require("express").json;

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

app.use(bodyParser());
app.use("/user", UserRouter);
app.use("/task", Task);

app.listen(port, () => {
  console.log(`server is running on port ${port}...`);
});
