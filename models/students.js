const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true,
    unique: true,
  },
  enrollDate: {
    type: String
  },
  studentName: {
    type: String
  },
  address: {
    type: String
  },
  district: {
    type: String
  },
  state: {
    type: String
  },
  mobileNumber: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  fatherName: {
    type: String
  },
  motherName: {
    type: String
  },
  franchise: {
    type: String
  },
  level: {
    type: String
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
    type: [Number]
  },
  paymentID: {
    type: String
  },
  certificates:{
    type: [String]
  },
  enableBtn:{
    type:Boolean,
    default:false
  },
  levelOrders: [{
        level: String,
        program: String,
        date: Date
    }]
});

const Studentlist = (module.exports = mongoose.model(
  "Studentlist",
  studentSchema
));
