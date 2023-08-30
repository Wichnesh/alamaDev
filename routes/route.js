var express = require("express");
var route = express.Router();
var Userslist = require("../models/userData");
var Franchiselist = require("../models/franchise");
const bcrypt = require("bcrypt");
var request = require("client-request");
const saltRounds = 10;
//SHOW USERS LIST
route.post("/getallusers", async (req, res) => {
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
//ADD USER
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
// POST LOGIN ADMIN
route.post("/login", async (req, res, next) => {
  console.log(req);
  let userName = req.body.userName;
  let password = req.body.password;
  try {
    let userCheck = await Userslist.findOne({ userName: userName });
    if (userCheck) {
      if (userCheck.password == password) {
        res.send(JSON.stringify({ status: true, isAdmin: userCheck.isAdmin }));
      } else {
        res.send(JSON.stringify({ status: false }));
      }
    } else {
      res.send(JSON.stringify({ status: false }));
    }
  } catch (err) {
    console.log(err);
  }
});
// POST LOGIN USER
route.post("/userlogin", async (req, res, next) => {
  console.log(req);
  let userName = req.body.userName;
  let password = req.body.password;
  try {
    let userCheck = await Userslist.findOne({ userName: userName });
    if (userCheck.approve) {
      if (userCheck.password == password) {
        res.send(JSON.stringify({ status: true, isAdmin: userCheck.isAdmin }));
      } else {
        res.send(JSON.stringify({ status: false }));
      }
    } else {
      res.send(JSON.stringify({ status: false, msg: "Unapproved User" }));
    }
  } catch (err) {
    console.log(err);
  }
});
// GENERATE ID
route.post("/generateID", async (req, res, next) => {
  let genID = await generateID();
  res.send(JSON.stringify({ status: true, data: genID }));
});
// FRANCHISE REGISTRATION
route.post("/franchise-reg", async (req, res, next) => {
  let newFranchise = Franchiselist({
    franchiseID: req.body.franchiseID,
    name: req.body.name,
    email: req.body.email,
    contactNumber: req.body.contactNumber,
    state: req.body.state,
    country: req.body.country,
    username: req.body.username,
    password: req.body.password,
    registerDate: req.body.registerDate,
  });
  newFranchise
    .save()
    .then(() => {
      res.status(201).json({
        status: true,
        message: "Franchise added successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: false,
        error: error,
      });
    });
});
// GET ALL FRANCHISE
route.post("/getallfranchise", async (req, res) => {
  try {
    let allFranchise = await Franchiselist.find({}, { __v: 0 });
    if (allFranchise) {
      res.status(201).json({
        status: true,
        data: allFranchise,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: false,
      msg: "DB error",
    });
  }
});
// HELPER FUNCTION
async function generateID() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetter1 = alphabet[Math.floor(Math.random() * alphabet.length)];
  const randomLetter2 = alphabet[Math.floor(Math.random() * alphabet.length)];
  let randomNumbers = Math.round(Math.random() * 10000);
  let genID = randomLetter1 + randomLetter2 + randomNumbers;
  let franchiseList = await Franchiselist.find({ franchiseID: genID });
  if (franchiseList) {
    generateID();
  }
  return genID;
}
module.exports = route;
