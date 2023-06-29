require("./config/db");
const session = require("express-session");

const app = require("express")();

const port = process.env.PORT || 5000;
const UserRouter = require("./router/user");
const Task = require("./router/task");

// for accepting post form data
const bodyParser = require("express").json;

app.use(bodyParser());
app.use("/user", UserRouter);
app.use("/task", Task);

app.listen(port, () => {
  console.log(`server is running on port ${port}...`);
});
