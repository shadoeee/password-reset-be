const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Password-Reset</h1>");
});

app.use("/users", userRoutes);

module.exports = app;
