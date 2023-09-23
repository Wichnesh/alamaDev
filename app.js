var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var path = require("path");
var mongoose = require("mongoose");
require("dotenv").config();

var app = express();

const port = process.env.PORT || 3000;

const dbUrl = process.env.MONGOLOCAL;
const ConnectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
//Connect to mongoDB
mongoose
  .connect(dbUrl, ConnectionParams)
  .then(() => {
    console.log("connected to Online DB");
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.connection.on("error", (err) => {
  if (err) {
    console.log("Error in DB connection " + err);
  }
});

app.use(cors());
app.use(bodyParser.json());
const route = require("./routes/route");
app.use("/api", route);

app.get("/", (req, res) => {
  res.send("Home");
});
app.listen(port, () => {
  console.log("Server started at PORT", port);
});
