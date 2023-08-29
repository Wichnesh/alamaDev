var express = require("express");
var route = express.Router();

var Userslist = require("../models/userData");

route.post("/userslist", async (req, res) => {
  try {
    const users = await Userslist.find({});
    if (users.length === 0) {
      res.status(201).json({
        status: true,
        message: "No Users in Database",
      });
    } else {
      res.status(201).json({
        status: true,
        data: users,
      });
    }
    console.log(users);
  } catch (err) {
    console.log(err);
  }
});

route.post("/adduser", (req, res, next) => {
  let newUser = Userslist({
    userName: req.body.userName,
    password: req.body.password,
    isAdmin: req.body.isAdmin,
  });
  newUser
    .save()
    .then(() => {
      res.status(201).json({
        status: true,
        message: "User added successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: false,
        error: error,
      });
    });
});

module.exports = route;
