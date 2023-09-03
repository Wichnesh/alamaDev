var express = require("express");
var route = express.Router();
const jwt = require("jsonwebtoken");
var Franchiselist = require("../models/franchise");
var Studentlist = require("../models/students");
var Itemlist = require("../models/items");
var Transactionlist = require("../models/transaction");
var Orderslist = require("../models/orders");
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
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
    district: req.body.district,
    username: req.body.username,
    password: req.body.password,
    registerDate: req.body.registerDate,
  });
  newFranchise
    .save()
    .then(() => {
      res.status(200).json({
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
      res.status(200).json({
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
    district: req.body.district,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email,
    fatherName: req.body.fatherName,
    motherName: req.body.motherName,
    franchise: req.body.franchise,
    level: req.body.level,
    items: req.body.items,
    tShirt: req.body.tShirt,
    program: req.body.program,
    cost: req.body.cost,
    paymentID: req.body.paymentID,
  });
  newStudent
    .save()
    .then(() => {
      res.status(200).json({
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
  // UPDATE STOCKS
  try {
    let tshirt = "tshirt" + newStudent.tShirt;
    await Itemlist.updateMany(
      { name: { $in: newStudent.items } },
      { $inc: { count: -1 } }
    );
    console.log(tshirt);
    if (newStudent.tShirt != 0) {
      await Itemlist.updateOne({ name: tshirt }, { $inc: { count: 1 } });
    }
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err,
    });
  }
  // CREATE TRANSACTION
  let transactions = [];
  newStudent.items.forEach(async (item) => {
    let newTransaction = {
      studentName: newStudent.studentName,
      studentID: newStudent.studentID,
      franchiseName: newStudent.franchise,
      itemName: item,
      quantity: -1,
    };
    transactions.push(newTransaction);
  });
  setTimeout(() => {
    console.log(transactions);
    Transactionlist.insertMany(transactions)
      .then(function () {
        console.log("Transaction inserted");
      })
      .catch(function (error) {
        console.log(error);
      });
  }, 4000);
});
//GET ALL STUDENTS
route.post("/getallstudents", async (req, res) => {
  try {
    let allStudent = await Studentlist.find({}, { __v: 0 });
    if (allStudent) {
      res.status(200).json({
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
route.post("/getfranchisestudent", async (req, res, next) => {
  let franchiseUsername = req.body.username;
  try {
    let allStudent = await Studentlist.find(
      { franchise: franchiseUsername },
      { __v: 0 }
    );
    if (allStudent) {
      res.status(200).json({
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
    name: req.body.name,
    count: req.body.count,
  });
  newItem
    .save()
    .then(() => {
      res.status(200).json({
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
      res.status(200).json({
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
  let id = req.body.id;
  let countReq = req.body.count;
  try {
    const filter = { _id: id };
    let updateData = {
      count: countReq,
    };
    let updatedData = await Itemlist.findOneAndUpdate(filter, updateData);
    res.send(JSON.stringify({ status: true, message: "Items updated!" }));
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err,
    });
  }
});
//CREATE ORDERS
route.post("/order", async (req, res) => {
  let newOrder = Orderslist({
    studentID: req.body.studentID,
    currentLevel: req.body.currentLevel,
    futureLevel: req.body.futureLevel,
    items: req.body.items,
  });
  newOrder
    .save()
    .then(() => {
      res.status(200).json({
        status: true,
        message: "Order added successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: false,
        error: error,
      });
    });
  try {
    await Itemlist.updateMany(
      { name: { $in: newOrder.items } },
      { $inc: { count: -1 } }
    );
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err,
    });
  }
  // CHANGE STUDENT LEVEL
  let studentIDReq = req.body.studentID;
  try {
    const filter = { studentID: studentIDReq };
    let updateData = {
      level: newOrder.futureLevel,
    };
    let updatedData = await Studentlist.findOneAndUpdate(filter, updateData);
    res.send(JSON.stringify({ status: true, message: "Student updated!" }));
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err,
    });
  }
});
route.post("/getallorders", async (req, res) => {
  try {
    let allOrders = await Orderslist.find({}, { __v: 0 });
    if (allOrders) {
      res.status(200).json({
        status: true,
        data: allOrders,
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
route.post("/getalltransaction", async (req, res) => {
  try {
    let allTransaction = await Transactionlist.find({}, { __v: 0 });
    if (allTransaction) {
      res.status(200).json({
        status: true,
        data: allTransaction,
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
route.post("/getitemtransaction", async (req, res) => {
  let itemNameReq = req.body.name;
  try {
    let allTransaction = await Transactionlist.find(
      { itemName: itemNameReq },
      { __v: 0 }
    );
    if (allTransaction) {
      res.status(200).json({
        status: true,
        data: allTransaction,
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
