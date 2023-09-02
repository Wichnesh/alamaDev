var express = require("express");
var route = express.Router();
const jwt = require("jsonwebtoken");
var Franchiselist = require("../models/franchise");
var Studentlist = require("../models/students");
const saltRounds = 10;

// LOGINUSER
route.post("/login", async (req, res, next) => {
  let userName = req.body.userName;
  let password = req.body.password;
  let user = {
    username: userName,
    password,
  };
  try {
    let userCheck = await Franchiselist.findOne({ username: userName });
    console.log(userCheck);
    if (userCheck) {
      if (userCheck.approve == true && userCheck.password == password) {
        jwt.sign({ user }, "secretkey", (err, token) => {
          res.send(
            JSON.stringify({ token, status: true, isAdmin: userCheck.isAdmin })
          );
        });
      } else {
        res.send(JSON.stringify({ status: false }));
      }
    } else {
      res.send(JSON.stringify({ status: false, msg: "Unapproved Member" }));
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
route.post("/generate-studentid", async (req, res, next) => {
  let genID = await generateStudentID();
  res.send(JSON.stringify({ status: true, data: genID.toString() }));
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
    let allFranchise = await Franchiselist.find({ isAdmin: false }, { __v: 0 });
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
//APPROVE USER
route.post("/approveUser", verifyToken, (req, res, next) => {
  let { franchiseID } = req.body;
  try {
    const filter = { franchiseID: franchiseID };
    const update = {
      approve: true,
    };
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) res.sendStatus(403);
      else {
        let updateData = await Franchiselist.findOneAndUpdate(filter, update);
        res.send(JSON.stringify({ status: true, msg: "User approved!" }));
      }
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      msg: err,
    });
  }
});
//STUDENT REGISTRATION
route.post("/student-reg", async (req, res) => {
  let newStudent = Studentlist({
    studentID: req.body.studentID,
    enrollDate: req.body.enrollDate,
    studentName: req.body.studentName,
    address: req.body.address,
    state: req.body.state,
    city: req.body.city,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email,
    fatherName: req.body.fatherName,
    motherName: req.body.motherName,
    franchise: req.body.franchise,
    country: req.body.country,
    level: req.body.level,
    items: {
      pencil: req.body.items.pencil,
      bag: req.body.items.bag,
      abacus: req.body.items.abacus,
      listeningAbility: req.body.items.listeningAbility,
      progressCard: req.body.items.progressCard,
      tShirt: req.body.items.tShirt,
    },
    program: req.body.program,
    cost: req.body.cost,
  });
  newStudent
    .save()
    .then(() => {
      res.status(201).json({
        status: true,
        message: "Student added successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: false,
        error: error,
      });
    });
});
//GET ALL STUDENTS
route.post("/getallstudents", async (req, res) => {
  try {
    let allStudent = await Studentlist.find({}, { __v: 0 });
    if (allStudent) {
      res.status(201).json({
        status: true,
        data: allStudent,
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
// HELPER FUNCTIONS
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
async function generateStudentID() {
  let studentsList = await Studentlist.find({});
  if (studentsList) {
    return studentsList.length + 1;
  }
}
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}
module.exports = route;
