const express = require("express");
const app = express();

const cors = require("cors");

// Enable Cross-Origin Resource Sharing
app.use(cors());

const port = process.env.PORT || 5000;
const UserRouter = require("./router/user");
const Task = require("./router/task");

app.use(bodyParser());
app.use("/user", UserRouter);
app.use("/task", Task);

app.listen(port, () => {
  console.log(`server is running on port ${port}...`);
});
