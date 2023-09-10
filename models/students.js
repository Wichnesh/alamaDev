const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true,
    unique: true,
  },
  enrollDate: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  franchise: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  items: {
    type: [String],
  },
  tShirt: {
    type: String,
  },
  program: {
    type: String,
    required: true,
  },
  cost: {
    type: [Number],
    required: true,
  },
  paymentID: {
    type: String,
    required: true,
  },
  levelOrders:{
    level:{
      type:String
    },
    date:{
      type:Date,
      default: new Date().toLocaleDateString("en-US"),
    }
  }
});

const Studentlist = (module.exports = mongoose.model(
  "Studentlist",
  studentSchema
));
