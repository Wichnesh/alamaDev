var express = require("express");
var route = express.Router();
const jwt = require("jsonwebtoken");
var Franchiselist = require("../models/franchise");
var Studentlist = require("../models/students");
var Itemlist = require("../models/items");
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
      res.send(JSON.stringify({ status: false, message: "Unapproved Member" }));
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
      message: "DB error",
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
        res.send(JSON.stringify({ status: true, message: "User approved!" }));
      }
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err,
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
    items: req.body.items,
    tShirt: req.body.tShirt,
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
      message: "DB error",
    });
  }
});
//GET Fanchise Registered Students
route.post("getfranchisestudent", async (req, res, next) => {
  let franchiseUsername = req.body.username;
  try {
    let allStudent = await Studentlist.find(
      { username: franchiseUsername },
      { __v: 0 }
    );
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
      message: "DB error",
    });
  }
});
route.post("/addItem", (req, res, next) => {
  let newItem = Itemlist({
    pencil: 0,
    bag: 0,
    studentAbacus: 0,
    listeningAbility: 0,
    progressCard: 0,
    tshirtsize8: 0,
    tshirtsize12: 0,
    tshirtsize16: 0,
    level1MA: 0,
    level2MA: 0,
    level3MA: 0,
    level4MA: 0,
    level5MA: 0,
    level6MA: 0,
    level1AA: 0,
    level2AA: 0,
    level3AA: 0,
    level4AA: 0,
    level5AA: 0,
    level6AA: 0,
    CB1MA: 0,
    CB2MA: 0,
    CB3MA: 0,
    CB4MA: 0,
    CB5MA: 0,
    CB6MA: 0,
    CB1AA: 0,
    CB2AA: 0,
    CB3AA: 0,
    CB4AA: 0,
    CB5AA: 0,
    CB6AA: 0,
    PB1MA: 0,
    PB2MA: 0,
    PB3MA: 0,
    PB4MA: 0,
    PB5MA: 0,
    PB6MA: 0,
    PB1AA: 0,
    PB2AA: 0,
    PB3AA: 0,
    PB4AA: 0,
    PB5AA: 0,
    PB6AA: 0,
  });
  newItem
    .save()
    .then(() => {
      res.status(201).json({
        status: true,
        message: "Item added successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: false,
        error: error,
      });
    });
});
// GET ALL STOCK
route.post("/getallitems", async (req, res, next) => {
  try {
    let allItem = await Itemlist.find({}, { __v: 0 });
    if (allItem) {
      res.status(201).json({
        status: true,
        data: allItem,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: false,
      message: "DB error",
    });
  }
});
// UPDATE STOCK
route.post("/editItem", async (req, res, next) => {
  let updateData = req.body;
  try {
    const filter = { _id: "64f33f0d3ed69d5cfdffab5f" };
    const update = {
      updateData,
    };
    // jwt.verify(req.token, "secretkey", async (err, authData) => {
    //   if (err) res.sendStatus(403);
    //   else {
    let updateData = await Itemlist.findOneAndUpdate(filter, update);
    res.send(JSON.stringify({ status: true, message: "Items approved!" }));
    // }
    // });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err,
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
